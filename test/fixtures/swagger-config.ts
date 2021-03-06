import { SwaggerMode } from '@ioc:Adonis/Addons/Swagger'

export default {
	uiEnabled: true,
	uiUrl: '/docs',
	specEnabled: true,
	specUrl: '/swagger.json',
	middleware: [],
	options: {
		definition: {
			openapi: '3.0.0',
			info: {
				title: 'Application with swagger docs',
				version: '1.0.0',
				description: 'My application with swagger docs',
			},
		},
		apis: ['app/**/*.ts', 'docs/swagger/**/*.yml', 'start/routes.ts'],
		basePath: '/',
	},
	specFilePath: 'docs/swagger.json',
	mode: 'RUNTIME' as SwaggerMode,
}
