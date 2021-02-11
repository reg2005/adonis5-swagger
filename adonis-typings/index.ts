declare module '@ioc:Adonis/Addons/Swagger' {
	import swaggerJSDoc from 'swagger-jsdoc'
	// export interface JsDocConfig {
	// 	definition: {
	// 		openapi?: string

	// 		info: {
	// 			title: string

	// 			version: string

	// 			description: string
	// 		}
	// 	}

	// 	apis: string[]

	// 	basePath?: string
	// }

	export type SwaggerMode = 'PRODUCTION' | 'RUNTIME'

	export interface SwaggerConfig {
		uiEnabled: boolean //disable or enable swaggerUi route
		uiUrl: string // url path to swaggerUI
		specEnabled: boolean //disable or enable swagger.json route
		specUrl: string

		middleware: string[] // middlewares array, for protect your swagger docs and spec endpoints

		options: swaggerJSDoc.Options

		specFilePath?: string
		mode?: SwaggerMode
	}
}
