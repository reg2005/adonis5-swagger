import Route from '@ioc:Adonis/Core/Route'
import Config from '@ioc:Adonis/Core/Config'
import { SwaggerController } from '../src/SwaggerController'
import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import { AuthMiddleware } from '../src/Auth/AuthMiddleware'
import { AuthHeaderDecoder } from '../src/Auth/AuthHeaderDecoder'

export default class SwaggerProvider {
	public static needsApplication = true

	constructor(protected app: ApplicationContract) {}

	public async register(): Promise<void> {
		this.registerMiddleware()
	}

	public async boot(): Promise<void> {
		this.initSwaggerRoutes()
	}

	private initSwaggerRoutes() {
		const config: typeof Config = this.app.container.resolveBinding('Adonis/Core/Config')
		const router: typeof Route = this.app.container.resolveBinding('Adonis/Core/Route')

		const controller = new SwaggerController(this.app.container)
		if (config.get('swagger.uiEnabled', true)) {
			router
				.get(
					`${config.get('swagger.uiUrl', 'docs')}/:fileName?`,
					controller.swaggerUI.bind(controller)
				)
				.middleware(config.get('swagger.middleware', []))
		}

		if (config.get('swagger.specEnabled', true)) {
			router
				.get(config.get('swagger.specUrl'), controller.swaggerFile.bind(controller))
				.middleware(this.mergeAuthMiddleware(config.get('swagger.middleware', [])))
		}
	}

	protected registerMiddleware() {
		this.app.container.singleton('Adonis/Addons/Swagger/AuthMiddleware', () => {
			const config: typeof Config = this.app.container.resolveBinding('Adonis/Core/Config')
			if (!config.get('swagger.swaggerAuth')) {
				return null
			}
			return new AuthMiddleware(config.get('swagger.swaggerAuth'), new AuthHeaderDecoder())
		})
	}

	protected mergeAuthMiddleware(middlewares: string[]): string[] {
		const config: typeof Config = this.app.container.resolveBinding('Adonis/Core/Config')
		return config.get('swagger.swaggerAuth.authMiddleware')
			? middlewares.concat(config.get('swagger.swaggerAuth.authMiddleware'))
			: middlewares
	}
}
