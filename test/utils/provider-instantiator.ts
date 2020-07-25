import { join } from 'path'
import { Filesystem } from '@poppinss/dev-utils'
import { Ioc } from '@adonisjs/fold/build/index'
import { Application } from '@adonisjs/application/build/standalone'

interface Provider {
	register(): void
	boot(): void
}

interface ServicesContainer {
	[key: string]: object
}

export default class ProviderInstantiator {
	protected ioc: Ioc

	constructor(protected fs: Filesystem) {
		this.initIoC()
	}

	public bindServices(services: ServicesContainer) {
		for (const [serviceNamespace, service] of Object.entries(services)) {
			this.ioc.bind(serviceNamespace, () => service)
		}
	}

	public instantiateProvider<T extends Provider>(Provider: new (ioc: Ioc) => T): Provider {
		return new Provider(this.ioc)
	}

	private initIoC() {
		this.ioc = new Ioc()
		this.ioc.bind('Adonis/Core/Application', () => this.instantiateApplication())
	}

	private instantiateApplication() {
		return new Application(join(this.fs.basePath, 'build'), {} as any, {} as any, {})
	}
}
