import supertest from 'supertest'
import swaggerResponse from './fixtures/swagger'
import swaggerConfig from './fixtures/swagger-config'
import SwaggerProvider from '../providers/SwaggerProvider'
import { SwaggerConfig, SwaggerMode } from '@ioc:Adonis/Addons/Swagger'
import { join } from 'path'
import { promises as fs } from 'fs'
import AdonisApplication from 'adonis-provider-tester'
import { authWithCredentials } from './fixtures/swagger-auth-config'
import { ServerContract } from '@ioc:Adonis/Core/Server'
import { buildBasicAuthToken } from './utils/build-basic-auth-token'

describe('Swagger e2e test - swagger enabled', () => {
	async function initServer(config: SwaggerConfig): Promise<AdonisApplication> {
		return new AdonisApplication([], [])
			.registerProvider(SwaggerProvider)
			.registerAppConfig({ configName: 'swagger', appConfig: config })
			.registerNamedMiddleware('swagger-auth', 'Adonis/Addons/Swagger/AuthMiddleware')
			.loadAppWithHttpServer()
	}

	it('Swagger enabled, should return swagger JSON from mounted endpoint', async () => {
		const app = await initServer(swaggerConfig)
		const httpServer = app.iocContainer.use('Adonis/Core/Server')

		const { text } = await supertest(httpServer.instance).get(swaggerConfig.specUrl).expect(200)

		expect(text).toEqual(JSON.stringify(swaggerResponse))

		await app.stopServer()
	})

	it('Swagger enabled, should return swagger ui', async () => {
		const app = await initServer(swaggerConfig)
		const httpServer = app.iocContainer.use('Adonis/Core/Server')

		await supertest(httpServer.instance)
			.get(swaggerConfig.uiUrl + '/index.html')
			.expect(200)
			.expect('Content-Type', /html/)

		await app.stopServer()
	})

	it('Swagger enabled, should return swagger ui', async () => {
		const app = await initServer(swaggerConfig)
		const httpServer = app.iocContainer.use('Adonis/Core/Server')

		await supertest(httpServer.instance)
			.get(swaggerConfig.uiUrl + '/index.html')
			.expect(200)
			.expect('Content-Type', /html/)

		await app.stopServer()
	})

	it('Swagger disabled, should return 404, route is not mounted', async () => {
		const app = await initServer({ ...swaggerConfig, specEnabled: false })
		const httpServer = app.iocContainer.use('Adonis/Core/Server')

		await supertest(httpServer.instance).get('/swagger.json').expect(404, {})

		await app.stopServer()
	})

	it('Swagger ui disabled, should return 404 response', async () => {
		const app = await initServer({ ...swaggerConfig, uiEnabled: false })

		const httpServer = app.iocContainer.use('Adonis/Core/Server')

		await supertest(httpServer.instance)
			.get(swaggerConfig.uiUrl + '/index.html')
			.expect(404)

		await app.stopServer()
	})

	it('Swagger in production mode, should return content of swagger file', async () => {
		const testContent = { test: true }
		const mode: SwaggerMode = 'PRODUCTION'

		const testOptions = { specFilePath: 'test.json', mode: mode }

		const app = await initServer({ ...swaggerConfig, ...testOptions })

		await fs.writeFile(join(app.application.appRoot, 'test.json'), JSON.stringify(testContent))
		const httpServer = app.iocContainer.use('Adonis/Core/Server')

		await supertest(httpServer.instance).get(swaggerConfig.specUrl).expect(200, testContent)

		await fs.unlink(join(app.application.appRoot, 'test.json'))

		await app.stopServer()
	})

	describe('Auth specs', () => {
		let app: AdonisApplication
		let httpServer: ServerContract

		beforeAll(async () => {
			const testOptions = { swaggerAuth: authWithCredentials }
			app = await initServer({ ...swaggerConfig, ...testOptions })
			httpServer = app.iocContainer.use('Adonis/Core/Server')
		})

		afterAll(async () => {
			await app.stopServer()
		})

		it('Swagger auth failed, should return 401 response  with correct headers', async () => {
			await supertest(httpServer.instance)
				.get(swaggerConfig.specUrl)
				.expect('WWW-Authenticate', 'Basic realm="Swagger docs"')
				.expect(401)
		})

		it('Swagger auth passed, should return data', async () => {
			const { login, password } = authWithCredentials.authCredentials as any
			await supertest(httpServer.instance)
				.get(swaggerConfig.specUrl)
				.set('Authorization', `Basic ${buildBasicAuthToken({ login, password })}`)
				.expect(200, swaggerResponse)
		})
	})
})
