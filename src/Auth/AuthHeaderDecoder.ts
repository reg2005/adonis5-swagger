import { AuthCredentials } from '@ioc:Adonis/Addons/Swagger'

export type DecoderResultPayload = {
	success: boolean
	payload?: AuthCredentials
}

export class AuthHeaderDecoder {
	private static headerPattern = /^Basic (?<token>\w+={0,2})$/gi
	public decode(authHeader: string): DecoderResultPayload {
		const matchResult = AuthHeaderDecoder.headerPattern.exec(authHeader)
		if (!matchResult) {
			return { success: false }
		}

		const { token } = matchResult.groups as { token: string }

		const [login, password] = Buffer.from(token, 'base64').toString().split(':')

		return {
			success: !!(login && password),
			payload: { login, password },
		}
	}
}
