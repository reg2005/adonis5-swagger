import test from 'japa'
import { join } from 'path'
import ProviderInstantiator from './utils/provider-instantiator'
import { RouterContract, RouteContract } from '@ioc:Adonis/Core/Route'
import { ConfigContract } from '@ioc:Adonis/Core/Config'
import { Config } from '@adonisjs/config/build/standalone'
import { Router } from '@adonisjs/http-server/build/standalone'
import { Route } from '@adonisjs/http-server/build/src/Router/Route'
import { mock, when, instance, verify, anything } from 'ts-mockito'
import SwaggerProvider from '../providers/SwaggerProvider'
import { Filesystem } from '@poppinss/dev-utils'
import { registerHooks } from './utils/hooks-helpers'

let fs: Filesystem

const initFs = async () => {
	fs = new Filesystem(join(__dirname, '__app'))
}

const cleanFs = async () => {
	await fs.cleanup()
}

const globalHooks = {
	before: [initFs],
	after: [cleanFs],
}

test.group('Swagger enabled', (group) => {
	registerHooks(group, globalHooks)

	let testUrl = 'testUrl'
	let configMock: ConfigContract
	let routerMock: RouterContract
	let routerForMiddlewareMock: RouteContract
	let providerInstantiator: ProviderInstantiator

	group.before(() => {
		configMock = mock(Config)
		when(configMock.get('swagger.uiEnabled', true)).thenReturn(true)
		when(configMock.get('swagger.specEnabled', true)).thenReturn(true)
		when(configMock.get('swagger.uiUrl', 'docs')).thenReturn('docs')
		when(configMock.get('swagger.specUrl')).thenReturn(testUrl)
		when(configMock.get('swagger.middleware', [])).thenReturn([])
		when(configMock.get('swagger.options', {})).thenReturn({})

		routerMock = mock(Router)
		routerForMiddlewareMock = mock(Route)
		const routeForMiddlewareInstance = instance(routerForMiddlewareMock)
		when(routerMock.get(`docs/:fileName?`, anything())).thenReturn(routeForMiddlewareInstance)
		when(routerMock.get(testUrl, anything())).thenReturn(routeForMiddlewareInstance)

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

		verify(configMock.get('swagger.uiEnabled', true)).once()
		verify(configMock.get('swagger.specEnabled', true)).once()
		verify(configMock.get('swagger.uiUrl', 'docs')).once()
		verify(configMock.get('swagger.specUrl')).once()

		verify(routerMock.get(testUrl, anything())).once()
		verify(routerForMiddlewareMock.middleware(anything())).twice()
	})
})

test.group('Swagger disabled', (group) => {
	registerHooks(group, globalHooks)

	let testUrl = 'testUrl'
	let configMock: ConfigContract
	let routerMock: RouterContract
	let providerInstantiator: ProviderInstantiator

	group.before(() => {
		configMock = mock(Config)
		when(configMock.get('swagger.uiEnabled')).thenReturn(false)
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

		verify(configMock.get('swagger.specEnabled')).never()
		verify(configMock.get('swagger.uiEnabled')).never()
		verify(configMock.get('swagger.uiUrl', 'docs')).never()
		verify(configMock.get('swagger.specUrl')).never()

		verify(routerMock.get(testUrl, anything())).never()
	})
})
