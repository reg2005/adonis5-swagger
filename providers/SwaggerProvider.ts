import { IocContract } from '@adonisjs/fold'
import { Application } from '@adonisjs/application/build/standalone'

export default class SwaggerProvider {
	constructor(protected container: IocContract) {}

	public register() {
		this.container.singleton('Adonis/Addons/Swagger', () => {
			// const app: Application = this.container.use('Adonis/Core/Application')
		})
	}
}
