declare module '@ioc:Adonis/Addons/Swagger' {
	export interface SwaggerConfig {
		enabled: boolean
		specUrl: string

		options: {
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
	}
}
