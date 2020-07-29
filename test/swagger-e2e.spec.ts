import test from 'japa'
import supertest from 'supertest'
import { join } from 'path'
import { Filesystem } from '@poppinss/dev-utils'
import { Ignitor } from '@adonisjs/core/build/src/Ignitor'
import { setupApplicationFiles } from '../test-helpers'
import { createServer } from 'http'
import { promises as fs } from 'fs'
import swaggerResponse from './fixtures/swagger.json'
import swaggerConfig from './fixtures/swagger-config.json'

async function initServerWithSwaggerConfig(vfs: Filesystem, config) {
	await vfs.add(
		'providers/SwaggerProvider.ts',
		await fs.readFile(join(__dirname, '/../providers/SwaggerProvider.ts'), 'utf-8')
	)
	await vfs.add('config/swagger.json', JSON.stringify(config))
	await setupApplicationFiles(vfs, ['./providers/SwaggerProvider.ts'])
	const ignitor = new Ignitor(vfs.basePath)
	const bootstrapper = ignitor.boostrapper()
	const httpServer = ignitor.httpServer()
	const application = bootstrapper.setup()

	bootstrapper.registerAliases()
	bootstrapper.registerProviders(false)
	await bootstrapper.bootProviders()

	const app = application.container.use('Adonis/Core/Server')
	application.container.use('Adonis/Core/Route').get('/', () => 'handled')
	httpServer.injectBootstrapper(bootstrapper)

	await httpServer.start((handler) => createServer(handler))

	return { app, httpServer }
}

test.group('Swagger e2e test - swagger enabled', (group) => {
	let vfs

	group.beforeEach(async () => {
		vfs = new Filesystem(join(__dirname, '__app'))
	})

	group.afterEach(async () => {
		await vfs.cleanup()
	})

	test('Swagger enabled, should return swagger JSON from mounted endpoint', async (assert) => {
		const { app } = await initServerWithSwaggerConfig(vfs, swaggerConfig)
		const { text } = await supertest(app.instance).get(swaggerConfig.specUrl).expect(200)
		assert.equal(text, JSON.stringify(swaggerResponse))
		await app.instance.close()
	}).timeout(0)

	test('Swagger enabled, should return swagger ui', async () => {
		const { app } = await initServerWithSwaggerConfig(vfs, swaggerConfig)
		await supertest(app.instance)
			.get(swaggerConfig.uiUrl + '/index.html')
			.expect(200)
			.expect('Content-Type', /html/)

		await app.instance.close()
	}).timeout(0)

	test('Swagger ui disabled, should return 404 response', async () => {
		const { app } = await initServerWithSwaggerConfig(vfs, { ...swaggerConfig, uiEnabled: false })
		await supertest(app.instance)
			.get(swaggerConfig.uiUrl + '/index.html')
			.expect(404)

		await app.instance.close()
	}).timeout(0)

	test('Swagger disabled, should return 404, route is not mounted', async () => {
		const { app } = await initServerWithSwaggerConfig(vfs, { specEnabled: false })
		await supertest(app.instance).get('/swagger.json').expect(404)
		await app.instance.close()
	}).timeout(0)
})
