import Logger from '@ioc:Adonis/Core/Logger'
import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler'

export default class ExceptionHandler extends HttpExceptionHandler {
	constructor() {
		super(Logger)
	}

	protected ignoreStatuses = []

	public async handle(error, ctx) {
		return super.handle(error, ctx)
	}
}
