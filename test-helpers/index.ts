import { join } from 'path'
import { Filesystem } from '@poppinss/dev-utils'

const SECRET = 'asecureandlongrandomsecret'

export async function setupApplicationFiles(fs: Filesystem, additionalProviders?: string[]) {
	await fs.fsExtra.ensureDir(join(fs.basePath, 'config'))

	const providers = Array.isArray(additionalProviders)
		? additionalProviders.concat(join(__dirname, './providers/TestAppProvider.ts'))
		: [join(__dirname, './providers/TestAppProvider.ts')]

	await fs.add(
		'.adonisrc.json',
		JSON.stringify({
			autoloads: {
				App: './app',
			},
			providers: providers,
		})
	)

	await fs.add(
		'app/Exceptions/Handler.ts',
		`
import Logger from '@ioc:Adonis/Core/Logger'
import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler'

export default class ExceptionHandler extends HttpExceptionHandler {
  constructor () {
    super(Logger)
  }

  public handler(error, ctx) {
    console.log(error)
    super.handle(error, ctx)
  }
}`
	)

	await fs.add(
		'config/app.ts',
		`
    export const appKey = '${SECRET}'
    export const http = {
      trustProxy () {
        return true
      },
      cookie: {}
    }
    export const logger = {
        name: 'testApp',
        enabled: true,
        level: 'info',
        prettyPrint: true,
}
  `
	)

	await fs.add('.env', `APP_KEY = ${SECRET}`)
}
