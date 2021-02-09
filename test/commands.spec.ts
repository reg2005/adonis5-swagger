import test from 'japa'
import swaggerConfig from './fixtures/swagger-config'
import SwaggerProvider from '../providers/SwaggerProvider'
import { AdonisApplication } from '../test-helpers/TestAdonisApp'
import { SwaggerConfig } from '@ioc:Adonis/Addons/Swagger'
import GenerateSwaggerFile from '../commands/GenerateSwaggerFile'
import { Kernel } from '@adonisjs/ace'
import { promises as fs } from 'fs'
import { join } from 'path'
import { Application } from '@adonisjs/application'
import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'

chai.use(chaiAsPromised)

const expect = chai.expect

async function initApplication(config: SwaggerConfig): Promise<AdonisApplication> {
	return new AdonisApplication([], [])
		.registerProvider(SwaggerProvider)
		.registerAppConfig({ configName: 'swagger', appConfig: config })
		.loadApp()
}

async function initCommand(application: Application): Promise<GenerateSwaggerFile> {
	return new GenerateSwaggerFile(application, new Kernel(application))
}

test.group('Swagger file generate command', () => {
	test('should write to file system swagger spec file', async () => {
		const app = await initApplication(swaggerConfig)
		const command = await initCommand(app.application)
		const swaggerDir = join(app.application.appRoot, 'docs')
		await fs.mkdir(swaggerDir, { recursive: true })

		await command.run()
		const generatedFilePath = join(app.application.appRoot, swaggerConfig.specFilePath)
		const swaggerFile = await fs.readFile(generatedFilePath)
		const swaggerFileContent = JSON.parse(swaggerFile.toString())

		expect(swaggerFileContent).to.deep.include(swaggerConfig.options.definition)

		await fs.unlink(generatedFilePath)
	}).timeout(0)

	test("should throw error, config doesn't contain required option", async () => {
		const { specFilePath, ...brokenConfig } = swaggerConfig
		const app = await initApplication(brokenConfig)
		const command = await initCommand(app.application)

		expect(command.run()).to.be.rejectedWith(
			Error,
			"Config option 'swagger.specFilePath' should be specified for using this command"
		)
	}).timeout(0)
})
