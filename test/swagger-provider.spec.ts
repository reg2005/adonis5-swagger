import test from 'japa'
import { join } from 'path'
import ProviderInstantiator from './utils/provider-instantiator'
import { RouterContract } from '@ioc:Adonis/Core/Route'
import { ConfigContract } from '@ioc:Adonis/Core/Config'
import { Config } from '@adonisjs/config/build/standalone'
import { Router } from '@adonisjs/http-server/build/standalone'
import { mock, when, instance, verify, anything } from 'ts-mockito'
import SwaggerProvider from '../providers/SwaggerProvider'
import { Filesystem } from '@poppinss/dev-utils'

test.group('Swagger provider', (topGroup) => {
	let fs: Filesystem
	topGroup.before(() => {
		fs = new Filesystem(join(__dirname, '__app'))
	})

	topGroup.after(async () => {
		await fs.cleanup()
	})

	test.group('Swagger enabled', (group) => {
		let testUrl = 'testUrl'
		let configMock: ConfigContract
		let routerMock: RouterContract
		let providerInstantiator: ProviderInstantiator

		group.before(() => {
			configMock = mock(Config)
			when(configMock.get('swagger.specEnabled')).thenReturn(true)
			when(configMock.get('swagger.specUrl')).thenReturn(testUrl)
			when(configMock.get('swagger.options', {})).thenReturn({})

			routerMock = mock(Router)
			when(routerMock.get(testUrl, anything())).thenReturn({} as any)

			providerInstantiator = new ProviderInstantiator(fs)
			providerInstantiator.bindServices({
				'Adonis/Core/Config': instance(configMock),
				'Adonis/Core/Route': instance(routerMock),
			})
		})

		test('should instantiate provider with enabled swagger', () => {
			const swaggerProvider = providerInstantiator.instantiateProvider(SwaggerProvider)
			swaggerProvider.register()
			swaggerProvider.boot()

			verify(configMock.get('swagger.specEnabled')).once()
			verify(configMock.get('swagger.specUrl')).once()

			verify(routerMock.get(testUrl, anything())).once()
		})
	})

	test.group('Swagger disabled', (group) => {
		let testUrl = 'testUrl'
		let configMock: ConfigContract
		let routerMock: RouterContract
		let providerInstantiator: ProviderInstantiator

		group.before(() => {
			configMock = mock(Config)
			when(configMock.get('swagger.specEnabled')).thenReturn(false)

			routerMock = mock(Router)
			when(routerMock.get(testUrl, anything())).thenReturn({} as any)

			providerInstantiator = new ProviderInstantiator(this.fs)
			providerInstantiator.bindServices({
				'Adonis/Core/Config': instance(configMock),
				'Adonis/Core/Route': instance(routerMock),
			})
		})

		test('should not init swagger module, swagger was disabled', () => {
			const swaggerProvider = providerInstantiator.instantiateProvider(SwaggerProvider)
			swaggerProvider.register()
			swaggerProvider.boot()

			verify(configMock.get('swagger.specEnabled')).once()
			verify(configMock.get('swagger.specUrl')).never()

			verify(routerMock.get(testUrl, anything())).never()
		})
	})
})
