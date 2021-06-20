const { iocTransformer } = require('@adonisjs/ioc-transformer')

const testFrameworkConfiguration = {
	aliases: {
		App: 'app',
		Contracts: 'contracts',
		Config: 'config',
		Database: 'database',
	},
}

module.exports = {
	name: 'adonis-ioc-tranformer',
	factory: () => iocTransformer(require('typescript/lib/typescript'), testFrameworkConfiguration),
}
