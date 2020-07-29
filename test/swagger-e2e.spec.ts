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

let vfs = new Filesystem(join(__dirname, '__app'))

async function initServerWithSwaggerConfig(config) {
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

	const server = application.container.use('Adonis/Core/Server')
	application.container.use('Adonis/Core/Route').get('/', () => 'handled')
	httpServer.injectBootstrapper(bootstrapper)

	await httpServer.start((handler) => createServer(handler))

	return server
}

test.group('Swagger e2e test', (topGroup) => {
	topGroup.afterEach(async () => {
		await vfs.cleanup()
	})

	test.group('Swagger enabled', async () => {
		test('should return swagger JSON from mounted endpoint', async (assert) => {
			const server = await initServerWithSwaggerConfig(swaggerConfig)
			const { text } = await supertest(server.instance).get('/swagger.json').expect(200)
			assert.equal(text, JSON.stringify(swaggerResponse))
			await server.instance.close()
		})
	})

	test.group('Swagger disabled', async () => {
		test('should return 404, swagger was disabled and route is not mounted', async () => {
			const server = await initServerWithSwaggerConfig({ specEnabled: false })
			await supertest(server.instance).get('/swagger.json').expect(404)
			await server.instance.close()
		})
	})
})
