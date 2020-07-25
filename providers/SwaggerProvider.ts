import { IocContract } from '@adonisjs/fold/build'
import Route from '@ioc:Adonis/Core/Route'
import Config from '@ioc:Adonis/Core/Config'
import swaggerJSDoc from 'swagger-jsdoc'

export default class SwaggerProvider {
	constructor(protected container: IocContract) {}

	public register(): void {}

	public boot(): void {
		this.initSwaggerRoutes()
	}

	private initSwaggerRoutes() {
		const config: typeof Config = this.container.use('Adonis/Core/Config')
		const router: typeof Route = this.container.use('Adonis/Core/Route')

		if (config.get('swagger.enabled')) {
			router.get(config.get('swagger.specUrl'), () => {
				return swaggerJSDoc(config.get('swagger.options', {}))
			})
		}
	}
}
