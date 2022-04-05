import { IocContract } from '@adonisjs/fold/build'
import { ConfigContract } from '@ioc:Adonis/Core/Config'
import mime from 'mime'
import buildJsDocConfig from './Utils/buildJsDocConfig'
import swaggerJSDoc from 'swagger-jsdoc'
import * as fs from 'fs'
import { promises as fsp } from 'fs'
import { Application } from '@adonisjs/application'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { join } from 'path'
import { ReadStream } from 'fs'

export class SwaggerController {
	private config: ConfigContract
	private app: Application

	constructor(protected IoC: IocContract) {
		this.config = IoC.use('Adonis/Core/Config')
		this.app = this.IoC.use('Adonis/Core/Application')
	}

	public async swaggerUI({ params, response }: HttpContextContract) {
		const swaggerUiAssetPath =
			this.config.get('swagger.swaggerUiDistPath') || require('swagger-ui-dist').getAbsoluteFSPath()
		if (!params.fileName) {
			const baseUrl = this.config.get('swagger.uiUrl', '/docs').replace('/', '')
			return response.redirect(`/${baseUrl}/index.html`)
		}

		const fileName = params.fileName ? params.fileName : 'index.html'
		const path = join(swaggerUiAssetPath, fileName)
		const contentType = mime.getType(path)

		if (fileName.includes('initializer')) {
			const initializer = await fsp.readFile(path, 'utf-8')
			return response
				.header('Content-Type', contentType)
				.send(
					initializer.replace(
						'https://petstore.swagger.io/v2/swagger.json',
						this.config.get('swagger.specUrl')
					)
				)
		} else {
			return response.header('Content-Type', contentType).stream(fs.createReadStream(path))
		}
	}

	public async swaggerFile({ response }: HttpContextContract): Promise<void> {
		const mode = this.config.get('swagger.mode', 'RUNTIME')
		if (mode === 'RUNTIME') {
			response.send(swaggerJSDoc(buildJsDocConfig(this.config.get('swagger.options', {}))))
		} else {
			response
				.safeHeader('Content-type', 'application/json')
				.stream(this.getSwaggerSpecFileContent(), () => {
					return ['Unable to find file', 404]
				})
		}
	}

	protected getSwaggerSpecFileContent(): ReadStream {
		const filePath = join(this.app.appRoot, this.config.get('swagger.specFilePath'))
		return fs.createReadStream(filePath)
	}
}
