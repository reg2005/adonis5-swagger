import test from 'japa'
import supertest from 'supertest'
import swaggerResponse from './fixtures/swagger.json'
import swaggerConfig from './fixtures/swagger-config.json'
import SwaggerProvider from '../providers/SwaggerProvider'
import { AdonisApplication } from '../test-helpers/TestAdonisApp'
import { SwaggerConfig } from '@ioc:Adonis/Addons/Swagger'

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
})
