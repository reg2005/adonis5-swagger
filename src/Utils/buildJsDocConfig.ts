import resolveApiPaths from './resolveApis'
import { JsDocConfig } from '@ioc:Adonis/Addons/Swagger'

export default function ({ apis, ...restOptions }: JsDocConfig): JsDocConfig {
	return {
		...restOptions,
		apis: resolveApiPaths(apis),
	}
}
