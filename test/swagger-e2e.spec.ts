import test from 'japa'
import supertest from 'supertest'
import swaggerResponse from './fixtures/swagger'
import swaggerConfig from './fixtures/swagger-config'
import SwaggerProvider from '../providers/SwaggerProvider'
import { AdonisApplication } from '../test-helpers/TestAdonisApp'
import { SwaggerConfig, SwaggerMode } from '@ioc:Adonis/Addons/Swagger'
import { join } from 'path'
import { promises as fs } from 'fs'

async function initServerWithSwaggerConfig(config: SwaggerConfig): Promise<AdonisApplication> {
	return new AdonisApplication([], [])
		.registerProvider(SwaggerProvider)
		.registerAppConfig({ configName: 'swagger', appConfig: config })
		.loadAppWithHttpServer()
}

test.group('Swagger e2e test - swagger enabled', () => {
	test('Swagger enabled, should return swagger JSON from mounted endpoint', async (assert) => {
		const app = await initServerWithSwaggerConfig(swaggerConfig)
		const httpServer = app.iocContainer.use('Adonis/Core/Server')

		const { text } = await supertest(httpServer.instance).get(swaggerConfig.specUrl).expect(200)
		assert.equal(text, JSON.stringify(swaggerResponse))

		await app.stopServer()
	}).timeout(0)

	test('Swagger enabled, should return swagger ui', async () => {
		const app = await initServerWithSwaggerConfig(swaggerConfig)
		const httpServer = app.iocContainer.use('Adonis/Core/Server')

		await supertest(httpServer.instance)
			.get(swaggerConfig.uiUrl + '/index.html')
			.expect(200)
			.expect('Content-Type', /html/)

		await app.stopServer()
	}).timeout(0)

	test('Swagger enabled, should return swagger ui', async () => {
		const app = await initServerWithSwaggerConfig(swaggerConfig)
		const httpServer = app.iocContainer.use('Adonis/Core/Server')

		await supertest(httpServer.instance)
			.get(swaggerConfig.uiUrl + '/index.html')
			.expect(200)
			.expect('Content-Type', /html/)

		await app.stopServer()
	}).timeout(0)

	test('Swagger disabled, should return 404, route is not mounted', async () => {
		const app = await initServerWithSwaggerConfig({ ...swaggerConfig, specEnabled: false })
		const httpServer = app.iocContainer.use('Adonis/Core/Server')

		await supertest(httpServer.instance).get('/swagger.json').expect(404)

		await app.stopServer()
	}).timeout(0)

	test('Swagger ui disabled, should return 404 response', async () => {
		const app = await initServerWithSwaggerConfig({ ...swaggerConfig, uiEnabled: false })
		const httpServer = app.iocContainer.use('Adonis/Core/Server')

		await supertest(httpServer.instance)
			.get(swaggerConfig.uiUrl + '/index.html')
			.expect(404)

		await app.stopServer()
	}).timeout(0)

	test('Swagger in production mode, should return content of swagger file', async (assert) => {
		const testContent = { test: true }
		const mode: SwaggerMode = 'PRODUCTION'
		const testOptions = { specFilePath: 'docs/test.json', mode: mode }
		const app = await initServerWithSwaggerConfig({ ...swaggerConfig, ...testOptions })
		await fs.writeFile(
			join(app.application.appRoot, testOptions.specFilePath),
			JSON.stringify(testContent)
		)

		const httpServer = app.iocContainer.use('Adonis/Core/Server')

		const { text } = await supertest(httpServer.instance).get(swaggerConfig.specUrl).expect(200)

		assert.deepEqual(JSON.parse(text), testContent)

		await app.stopServer()
		await fs.unlink(join(app.application.appRoot, testOptions.specFilePath))
	}).timeout(0)
})
