import { AuthCredentials } from '@ioc:Adonis/Addons/Swagger'

export function buildBasicAuthToken({ login, password }: AuthCredentials): string {
	return Buffer.from([login, password].join(':')).toString('base64')
}
