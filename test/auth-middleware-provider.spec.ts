import SwaggerProvider from '../providers/SwaggerProvider'
import AdonisApplication from 'adonis-provider-tester'
import * as SwaggerFixtureConfig from './fixtures/swagger-config'
import { SwaggerAuthConfig } from '@ioc:Adonis/Addons/Swagger'
import { authWithCredentials } from './fixtures/swagger-auth-config'
import { AuthMiddleware } from '../src/Auth/AuthMiddleware'

describe('Auth middleware - provider test', () => {
	async function initServer(config: SwaggerAuthConfig | null): Promise<AdonisApplication> {
		return new AdonisApplication([], [])
			.registerProvider(SwaggerProvider)
			.registerAppConfig({
				configName: 'swagger',
				appConfig: { ...SwaggerFixtureConfig, swaggerAuth: config },
			})
			.loadApp()
	}

	it('Swagger middleware registered', async () => {
		const app = await initServer(authWithCredentials)
		const objectFromContainer = app.iocContainer.use('Adonis/Addons/Swagger/AuthMiddleware')
		expect(objectFromContainer).toBeInstanceOf(AuthMiddleware)
		await app.stopApp()
	})

	it("Swagger middleware register was skipped, config wasn't provided", async () => {
		const app = await initServer(null)
		const importFromContainer = () =>
			app.iocContainer.resolveBinding('Adonis/Addons/Swagger/AuthMiddleware')
		importFromContainer()
		expect(importFromContainer()).toBeNull()
		await app.stopApp()
	})
})
