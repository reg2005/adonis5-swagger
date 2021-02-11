import { BaseCommand } from '@adonisjs/core/build/standalone'
import { ConfigContract } from '@ioc:Adonis/Core/Config'
import buildJsDocConfig from '../src/Utils/buildJsDocConfig'
import swaggerJSDoc from 'swagger-jsdoc'
import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import { KernelContract } from '@adonisjs/ace/build/src/Contracts'
import { promises as fs } from 'fs'
import { join } from 'path'
export default class GenerateSwaggerFile extends BaseCommand {
	public static commandName = 'swagger:generate'
	public static description = 'Generate swagger file'
	public static settings = {
		loadApp: true,
	}
	private config: ConfigContract

	constructor(application: ApplicationContract, kernel: KernelContract) {
		super(application, kernel)
		this.config = application.container.use('Adonis/Core/Config')
	}

	/**
	 * Execute command
	 */
	public async run(): Promise<void> {
		const swaggerFileContent = swaggerJSDoc(
			buildJsDocConfig(this.config.get('swagger.options', {}))
		)

		if (!this.config.get('swagger.specFilePath')) {
			throw new Error(
				"Config option 'swagger.specFilePath' should be specified for using this command"
			)
		}

		const filePath = join(this.application.appRoot, this.config.get('swagger.specFilePath'))
		await fs.writeFile(filePath, JSON.stringify(swaggerFileContent))
	}
}
