import swaggerConfig from './fixtures/swagger-config'
import SwaggerProvider from '../providers/SwaggerProvider'
import { SwaggerConfig } from '@ioc:Adonis/Addons/Swagger'
import GenerateSwaggerFile from '../commands/GenerateSwaggerFile'
import { Kernel } from '@adonisjs/ace'
import { promises as fs } from 'fs'
import { join } from 'path'
import AdonisApplication from 'adonis-provider-tester'
import { ApplicationContract } from '@ioc:Adonis/Core/Application'

describe('Swagger file generate command', () => {
	async function initApplication(config: SwaggerConfig): Promise<AdonisApplication> {
		return new AdonisApplication([], [])
			.registerProvider(SwaggerProvider)
			.registerAppConfig({ configName: 'swagger', appConfig: config })
			.loadApp()
	}

	async function initCommand(application: ApplicationContract): Promise<GenerateSwaggerFile> {
		return new GenerateSwaggerFile(application, new Kernel(application))
	}

	it('should write to file system swagger spec file', async () => {
		const app = await initApplication(swaggerConfig)
		const command = await initCommand(app.application)
		const swaggerDir = join(app.application.appRoot, 'docs')
		await fs.mkdir(swaggerDir, { recursive: true })

		await command.run()
		const generatedFilePath = join(app.application.appRoot, swaggerConfig.specFilePath)
		const swaggerFile = await fs.readFile(generatedFilePath)
		const swaggerFileContent = JSON.parse(swaggerFile.toString())

		expect(swaggerFileContent).toMatchObject(swaggerConfig.options.definition)

		await fs.unlink(generatedFilePath)
	})

	it("should throw error, config doesn't contain required option", async () => {
		const { specFilePath, ...brokenConfig } = swaggerConfig
		const app = await initApplication(brokenConfig)
		const command = await initCommand(app.application)

		return expect(command.run()).rejects.toThrow(
			"Config option 'swagger.specFilePath' should be specified for using this command"
		)
	})
})
