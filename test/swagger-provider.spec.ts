import test from 'japa'
import { RouterContract, RouteContract } from '@ioc:Adonis/Core/Route'
import { ConfigContract } from '@ioc:Adonis/Core/Config'
import { Router } from '@adonisjs/http-server/build/standalone'
import { Route } from '@adonisjs/http-server/build/src/Router/Route'
import { mock, when, instance, verify, anything } from 'ts-mockito'
import SwaggerProvider from '../providers/SwaggerProvider'
import { Config } from '@adonisjs/config'
import { AdonisApplication } from '../test-helpers/TestAdonisApp'
import { ContainerBindings } from '@ioc:Adonis/Core/Application'

async function createAdonisApp(mockedServices: Partial<ContainerBindings>) {
	const app = await new AdonisApplication([], []).loadApp()
	for (const [alias, mockedService] of Object.entries(mockedServices)) {
		app.iocContainer.bind(alias, () => mockedService)
	}

	return app
}
test.group('Swagger enabled', (group) => {
	let testUrl = 'testUrl'
	let configMock: ConfigContract
	let routerMock: RouterContract
	let routerForMiddlewareMock: RouteContract
	let app: AdonisApplication

	group.before(async () => {
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

		app = await createAdonisApp({
			'Adonis/Core/Config': instance(configMock),
			'Adonis/Core/Route': instance(routerMock),
		})
	})

	group.after(async () => {
		await app.stopApp()
	})

	test('should instantiate provider with enabled swagger', async () => {
		const swaggerProvider = new SwaggerProvider(app.application)
		await swaggerProvider.register()
		await swaggerProvider.boot()

		verify(configMock.get('swagger.uiEnabled', true)).once()
		verify(configMock.get('swagger.specEnabled', true)).once()
		verify(configMock.get('swagger.uiUrl', 'docs')).once()
		verify(configMock.get('swagger.specUrl')).once()

		verify(routerMock.get(testUrl, anything())).once()
		verify(routerForMiddlewareMock.middleware(anything())).twice()
	})
})

test.group('Swagger disabled', (group) => {
	let testUrl = 'testUrl'
	let configMock: ConfigContract
	let routerMock: RouterContract
	let adonisApp: AdonisApplication

	group.before(async () => {
		configMock = mock(Config)
		when(configMock.get('swagger.uiEnabled')).thenReturn(false)
		when(configMock.get('swagger.specEnabled')).thenReturn(false)

		routerMock = mock(Router)
		when(routerMock.get(testUrl, anything())).thenReturn({} as any)

		adonisApp = await createAdonisApp({
			'Adonis/Core/Config': instance(configMock),
			'Adonis/Core/Route': instance(routerMock),
		})
	})

	group.after(async () => {
		await adonisApp.stopApp()
	})

	test('should not init swagger module, swagger was disabled', async () => {
		const swaggerProvider = new SwaggerProvider(adonisApp.application)
		await swaggerProvider.register()
		await swaggerProvider.boot()

		verify(configMock.get('swagger.specEnabled')).never()
		verify(configMock.get('swagger.uiEnabled')).never()
		verify(configMock.get('swagger.uiUrl', 'docs')).never()
		verify(configMock.get('swagger.specUrl')).never()

		verify(routerMock.get(testUrl, anything())).never()
	})
})
