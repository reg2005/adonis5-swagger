import { IocContract } from '@adonisjs/fold/build'
import Route from '@ioc:Adonis/Core/Route'
import Config from '@ioc:Adonis/Core/Config'
import { SwaggerController } from '../src/SwaggerController'

export default class SwaggerProvider {
	constructor(protected container: IocContract) {}

	public register(): void {}

	public async boot(): Promise<void> {
		this.initSwaggerRoutes()
	}

	private initSwaggerRoutes() {
		const config: typeof Config = this.container.use('Adonis/Core/Config')
		const router: typeof Route = this.container.use('Adonis/Core/Route')

		const controller = new SwaggerController(this.container)
		if (config.get('swagger.uiEnabled', true)) {
			router
				.get(
					`${config.get('swagger.uiUrl', 'docs')}/:fileName?`,
					controller.swaggerUI.bind(controller)
				)
				.middleware(config.get('swagger.middleware', []) as string[])
		}

		if (config.get('swagger.specEnabled', true)) {
			router
				.get(config.get('swagger.specUrl'), controller.swaggerFile.bind(controller))
				.middleware(config.get('swagger.middleware', []))
		}
	}
}
