import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { AuthCredentials, SwaggerAuthConfig } from '@ioc:Adonis/Addons/Swagger'
import { AuthHeaderDecoder } from './AuthHeaderDecoder'

export class AuthMiddleware {
	constructor(
		protected readonly config: SwaggerAuthConfig,
		protected readonly tokenDecoder: AuthHeaderDecoder
	) {}

	public async handle({ request, response }: HttpContextContract, next: () => Promise<void>) {
		const authHeader = request.headers().authorization || ''
		const decodeResult = this.tokenDecoder.decode(authHeader)

		if (!decodeResult.success || !(await this.verifyCredentials(decodeResult.payload))) {
			return response.status(401).header('WWW-Authenticate', `Basic realm="Swagger docs"`).send({})
		}

		await next()
	}

	protected async verifyCredentials(
		userCredentials: AuthCredentials | undefined
	): Promise<boolean> {
		if (!userCredentials) {
			return false
		}
		const { login, password } = userCredentials

		if (typeof this.config.authCheck === 'function') {
			return this.config.authCheck(login, password)
		}

		return (
			this.config?.authCredentials?.login === login &&
			this.config?.authCredentials?.password === password
		)
	}
}
