import { BaseCommand, flags, Kernel } from '@adonisjs/ace'
import { ApplicationContract } from '@ioc:Adonis/Core/Application'
/**
 *
 * @version 1.0.0
 * @adonis-version 5.0+
 */
export default class SwaggerExport extends BaseCommand {
	public static commandName = 'swagger:export'
	public static description = 'Export config file & swagger-ui assets'

	@flags.string({ description: 'Hide the console log' })
	public silent: boolean

	public static settings = {
		loadApp: true,
	}

	constructor(application: ApplicationContract, kernel: Kernel) {
		super(application, kernel)
		this.application = application
	}
	/**
	 * Execute command
	 */
	public async handle(): Promise<void> {

	}
}
