import { join } from 'path'
import test from 'japa'
import { Filesystem } from '@poppinss/dev-utils'
import { Ioc } from '@adonisjs/fold/build/index'
import { Application } from '@adonisjs/application/build/standalone'
import SwaggerProvider from '../providers/SwaggerProvider'
import { Logger } from '@adonisjs/logger/build/standalone'
import { LoggerConfig } from '@ioc:Adonis/Core/Logger'

export const loggerConfig: LoggerConfig = {
	name: 'TEST_APP',
	enabled: true,
	level: 'debug',
	prettyPrint: true,
}

const fs = new Filesystem(join(__dirname, '__app'))
test.group('Scheduler', () => {
	// function getApp() {
	// 	console.log('fs.basePath', fs.basePath)
	// 	const ioc = new Ioc()
	// 	ioc.bind('Adonis/Core/Application', () => new Application(join(fs.basePath, 'build'), {} as any, {} as any, {}))
	// 	ioc.bind('Adonis/Core/Logger', () => new Logger(loggerConfig))
	// 	const swaggerProvider = new SwaggerProvider(ioc)
	// 	return { swaggerProvider }
	// }
	test('Test1', async (assert) => {
		// const { swaggerProvider } = getApp()
		
	}).timeout(15000)
})
