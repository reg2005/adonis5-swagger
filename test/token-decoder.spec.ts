import { AuthHeaderDecoder } from '../src/Auth/AuthHeaderDecoder'
import { buildBasicAuthToken } from './utils/build-basic-auth-token'

describe('Test on token decoder for auth middleware', () => {
	const decoder = new AuthHeaderDecoder()
	const credentials = { login: 'test', password: 'password' }

	it('should success decode token', async () => {
		const token = `Basic ${buildBasicAuthToken(credentials)}`
		const decodeResult = decoder.decode(token)
		expect(decodeResult).toEqual({ success: true, payload: credentials })
	})

	it('should return false as result, token does not follow required pattern', async () => {
		const token = `${buildBasicAuthToken(credentials)}`
		const decodeResult = decoder.decode(token)
		expect(decodeResult).toEqual({ success: false })
	})

	it('should return false as result, token has incorrect format', async () => {
		const token = `Basic test`
		const decodeResult = decoder.decode(token)
		expect(decodeResult).toMatchObject({ success: false })
	})
})
