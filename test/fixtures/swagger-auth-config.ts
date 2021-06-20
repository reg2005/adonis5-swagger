import { SwaggerAuthConfig } from '@ioc:Adonis/Addons/Swagger'

export const authWithCredentials: SwaggerAuthConfig = {
	authMiddleware: 'swagger-auth',
	authCredentials: {
		login: 'test',
		password: 'pass',
	},
}

export const authWithCustomChecker: SwaggerAuthConfig = {
	authMiddleware: 'swagger-auth',
	authCheck: () => Promise.resolve(true),
}
