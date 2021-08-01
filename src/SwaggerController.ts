import { IocContract } from '@adonisjs/fold/build'
import { ConfigContract } from '@ioc:Adonis/Core/Config'
import mime from 'mime'
import buildJsDocConfig from './Utils/buildJsDocConfig'
import swaggerJSDoc from 'swagger-jsdoc'
import { promises as fs } from 'fs'
import { Application } from '@adonisjs/application'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { join } from 'path'

export class SwaggerController {
	private config: ConfigContract

	constructor(protected IoC: IocContract) {
		this.config = IoC.use('Adonis/Core/Config')
	}

	public async swaggerUI({ params, response }: HttpContextContract) {
		const swaggerUiAssetPath =
			this.config.get('swagger.swaggerUiDistPath') || require('swagger-ui-dist').getAbsoluteFSPath()
		if (!params.fileName) {
			return response.redirect('/docs/index.html')
		}
		let fileName = params.fileName ? params.fileName : 'index.html'
		const path = join(swaggerUiAssetPath, fileName)
		const contentType = mime.getType(path)
		let data = await fs.readFile(path, 'utf-8')
		if (fileName.includes('index.html')) {
			//replace default host from index.html
			data = data.replace(
				'https://petstore.swagger.io/v2/swagger.json',
				this.config.get('swagger.specUrl')
			)
		}
		return response.header('Content-Type', contentType).send(data)
	}

	public async swaggerFile(): Promise<swaggerJSDoc.Options> {
		const mode = this.config.get('swagger.mode', 'RUNTIME')
		return mode === 'RUNTIME'
			? swaggerJSDoc(buildJsDocConfig(this.config.get('swagger.options', {})))
			: this.getSwaggerSpecFileContent()
	}

	private async getSwaggerSpecFileContent(): Promise<swaggerJSDoc.Options> {
		const app: Application = this.IoC.use('Adonis/Core/Application')
		const filePath = join(app.appRoot, this.config.get('swagger.specFilePath'))
		const fileContent = await fs.readFile(filePath)
		return JSON.parse(fileContent.toString())
	}
}
