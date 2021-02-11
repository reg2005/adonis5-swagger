import resolveApiPaths from './resolveApis'
import swaggerJSDoc from 'swagger-jsdoc'

export default function ({ apis, ...restOptions }: swaggerJSDoc.Options): swaggerJSDoc.Options {
	return {
		...restOptions,
		apis: resolveApiPaths(apis as string[]),
	}
}
