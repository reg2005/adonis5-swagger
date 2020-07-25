import { BaseCommand, flags, Kernel } from '@adonisjs/ace'
import { ApplicationContract } from '@ioc:Adonis/Core/Application'
/**
 *
 * @version 2.0.0
 * @adonis-version 5.0+
 */
export default class SwaggerRemove extends BaseCommand {
	public static commandName = 'swagger:remove'
	public static description = 'Remove config file & swagger-ui assets'

	@flags.string({ description: 'Hide the console log' })
	public silent: boolean

	public static settings = {
		loadApp: true,
	}

	constructor(app: ApplicationContract, kernel: Kernel) {
		super(app, kernel)
	}
	/**
	 * Execute command
	 */
	public async handle(): Promise<void> {}
}
