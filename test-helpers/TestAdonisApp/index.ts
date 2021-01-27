import { Ignitor } from '@adonisjs/core/build/src/Ignitor'
import { createServer } from 'http'
import { HttpServer } from '@adonisjs/core/build/src/Ignitor/HttpServer'
import { ConfigContract } from '@ioc:Adonis/Core/Config'
import { join } from 'path'
import { Application } from '@adonisjs/application'
import { ContainerBindings } from '@ioc:Adonis/Core/Application'
import { IocContract } from '@adonisjs/fold'

export interface AdonisProvider {
	ready?: () => Promise<void>

	shutdown?: () => Promise<void>

	register(): void

	boot(): Promise<void>
}

export interface ApplicationConfig {
	configName: string
	appConfig: object
}

export type ProviderConstructor = new (app: IocContract<ContainerBindings>) => AdonisProvider

export class AdonisApplication {
	private _httpServer: HttpServer
	private _application: Application
	private customerProviderInstances: AdonisProvider[] = []

	constructor(
		private customProviders: ProviderConstructor[] = [],
		private appConfigs: ApplicationConfig[] = []
	) {}

	public registerProvider(provider: ProviderConstructor): AdonisApplication {
		this.customProviders.push(provider)
		return this
	}

	public registerAppConfig(config: ApplicationConfig): AdonisApplication {
		this.appConfigs.push(config)
		return this
	}

	public async loadApp(): Promise<this> {
		await this.initApplication()
		await this.initCustomProviders()
		await this.registerProviders()
		await this.initApplicationConfigs()
		await this.bootProviders()

		return this
	}

	public async loadAppWithHttpServer(): Promise<this> {
		await this.loadApp()
		await this.startHttpServer()

		return this
	}

	private initApplication() {
		this._httpServer = new Ignitor(join(__dirname, 'testAdonisApp')).httpServer()
		this._application = this._httpServer.application
	}

	private async initCustomProviders() {
		this.customerProviderInstances = this.customProviders.map((Provider) => {
			return new Provider(this._application.container)
		})
	}

	private async registerProviders() {
		await this.application.setup()
		this.application.registerProviders()
		const { providersWithShutdownHook, providersWithReadyHook } = (this.application as any) as {
			providersWithReadyHook: AdonisProvider[]
			providersWithShutdownHook: AdonisProvider[]
		}

		this.customerProviderInstances.map((provider) => {
			if (typeof provider.ready === 'function') {
				providersWithReadyHook.push(provider)
			}

			if (typeof provider.shutdown === 'function') {
				providersWithShutdownHook.push(provider)
			}

			provider.register()
		})
	}

	private async initApplicationConfigs() {
		const config: ConfigContract = this._application.container.use('Adonis/Core/Config')
		this.appConfigs.map(({ appConfig, configName }) => config.set(configName, appConfig))
	}

	private async bootProviders() {
		this.customerProviderInstances.map((provider) => provider.boot())
		await this.application.bootProviders()
	}

	private async startHttpServer() {
		await this._httpServer.start((handler) => createServer(handler))
	}

	public get httpServer(): HttpServer {
		return this._httpServer
	}

	public get application(): Application {
		return this._application
	}

	public get iocContainer(): IocContract<ContainerBindings> {
		return this._application.container
	}

	public static initApplication(
		customProviders: ProviderConstructor[] = [],
		appConfigs: ApplicationConfig[] = []
	) {
		const app = new AdonisApplication(customProviders, appConfigs)
		return app.loadAppWithHttpServer()
	}

	public async stopServer() {
		await this._httpServer.close()
	}

	public async stopApp() {
		await this.application.shutdown()
	}
}
