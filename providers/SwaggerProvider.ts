import { IocContract } from '@adonisjs/fold/build'
import Route from '@ioc:Adonis/Core/Route'
import Config from '@ioc:Adonis/Core/Config'
import swaggerJSDoc from 'swagger-jsdoc'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { promises } from 'fs'
import { join } from 'path'
import mime from 'mime'
import buildJsDocConfig from '../src/Utils/buildJsDocConfig'

export default class SwaggerProvider {
	constructor(protected container: IocContract) {}

	public register(): void {}

	public async boot(): Promise<void> {
		this.initSwaggerRoutes()
	}

	private initSwaggerRoutes() {
		const config: typeof Config = this.container.use('Adonis/Core/Config')
		const router: typeof Route = this.container.use('Adonis/Core/Route')

		if (config.get('swagger.uiEnabled', true)) {
			router
				.get(
					`${config.get('swagger.uiUrl', 'docs')}/:fileName?`,
					async ({ params, response }: HttpContextContract) => {
						const swaggerUiAssetPath = require('swagger-ui-dist').getAbsoluteFSPath()
						if (!params.fileName) {
							return response.redirect('/docs/index.html')
						}
						let fileName = params.fileName ? params.fileName : 'index.html'
						const path = join(swaggerUiAssetPath, fileName)
						const contentType = mime.getType(path)
						let data = await promises.readFile(path, 'utf-8')
						if (fileName.includes('index.html')) {
							//replace default host from index.html
							data = data.replace(
								'https://petstore.swagger.io/v2/swagger.json',
								config.get('swagger.specUrl')
							)
						}
						return response.header('Content-Type', contentType).send(data)
					}
				)
				.middleware(config.get('swagger.middleware', []) as string[])
		}

		if (config.get('swagger.specEnabled', true)) {
			router
				.get(config.get('swagger.specUrl'), () => {
					return swaggerJSDoc(buildJsDocConfig(config.get('swagger.options', {})))
				})
				.middleware(config.get('swagger.middleware', []) as string[])
		}
	}
}
