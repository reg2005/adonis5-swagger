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
  export default class ExceptionHandler {
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
  `
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
	await fs.add(
		'config/swagger.ts',
		`
export default {
	enabled: true,
	specUrl: '/swagger.json',

	options: {
		definition: {
			openapi: '3.0.0',
			info: {
				title: 'Application with swagger docs',
				version: '1.0.0'
			}
		},

		apis: [
			'app/**/*.ts',
			'start/routes.ts'
		],
		basePath: '/'
	}
}
        `
	)

	await fs.add('.env', `APP_KEY = ${SECRET}`)
}
