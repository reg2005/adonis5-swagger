declare module '@ioc:Adonis/Addons/Swagger' {
	export interface JsDocConfig {
		definition: {
			openapi?: string

			info: {
				title: string

				version: string

				description: string
			}
		}

		apis: string[]

		basePath?: string
	}

	export interface SwaggerConfig {
		uiEnabled: boolean //disable or enable swaggerUi route
		uiUrl: string // url path to swaggerUI
		specEnabled: boolean //disable or enable swagger.json route
		specUrl: string

		middleware: string[] // middlewares array, for protect your swagger docs and spec endpoints

		options: JsDocConfig
	}
}
