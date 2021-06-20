declare module '@ioc:Adonis/Addons/Swagger' {
	import swaggerJSDoc from 'swagger-jsdoc'

	export type SwaggerMode = 'PRODUCTION' | 'RUNTIME'

	export type CredentialsCheckFunction = (
		login: string,
		password: string
	) => Promise<boolean> | boolean
	export type AuthCredentials = {
		login: string
		password: string
	}

	export type SwaggerAuthConfig = {
		authMiddleware: string

		authCheck?: CredentialsCheckFunction

		authCredentials?: AuthCredentials
	}

	export interface SwaggerConfig {
		uiEnabled: boolean //disable or enable swaggerUi route
		uiUrl: string // url path to swaggerUI
		specEnabled: boolean //disable or enable swagger.json route
		specUrl: string

		middleware: string[] // middlewares array, for protect your swagger docs and spec endpoints

		options: swaggerJSDoc.Options

		specFilePath?: string
		mode?: SwaggerMode
		swaggerUiDistPath?: string

		swaggerAuth?: SwaggerAuthConfig
	}
}
