import test from 'japa'
import supertest from 'supertest'
import { join } from 'path'
import { Filesystem } from '@poppinss/dev-utils'
import { Ignitor } from '@adonisjs/core/build/src/Ignitor'
import { setupApplicationFiles } from '../test-helpers'
import { createServer } from 'http'
import { promises as fs } from 'fs'

let vfs = new Filesystem(join(__dirname, '__app'))
test.group('Swagger provider', () => {
	test.group('Swagger enabled', async () => {
		test('should instantiate provider with enabled swagger', async (assert) => {
			await vfs.add(
				'providers/SwaggerProvider.ts',
				await fs.readFile(join(__dirname, '/../providers/SwaggerProvider.ts'), 'utf-8')
			)
			await setupApplicationFiles(vfs, ['./providers/SwaggerProvider.ts'])
			const ignitor = new Ignitor(vfs.basePath)
			const boostrapper = ignitor.boostrapper()
			const httpServer = ignitor.httpServer()
			const application = boostrapper.setup()

			boostrapper.registerAliases()
			boostrapper.registerProviders(false)
			await boostrapper.bootProviders()

			const server = application.container.use('Adonis/Core/Server')
			application.container.use('Adonis/Core/Route').get('/', () => 'handled')
			httpServer.injectBootstrapper(boostrapper)

			await httpServer.start((handler) => createServer(handler))
			assert.isTrue(httpServer.application.isReady)

			const { text } = await supertest(server.instance).get('/swagger.json').expect(200)
			console.log(text)
			server.instance.close()
		})
	})
})
