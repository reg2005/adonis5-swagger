const { configure } = require('japa')
const { argv } = require('yargs')
const tsnode = require('ts-node')
const { iocTransformer } = require('@adonisjs/ioc-transformer')
const { files: typingsFiles } = require('./tsconfig.json')

const testFrameworkConfiguration = {
	aliases: {
		App: 'app',
		Contracts: 'contracts',
		Config: 'config',
		Database: 'database',
	},
}

tsnode.register({
	transformers: {
		after: [iocTransformer(require('typescript/lib/typescript'), testFrameworkConfiguration)],
	},
	files: typingsFiles,
})

const { files = ['test/**/*.spec.ts'], grep } = argv

configure({
	files: Array.isArray(files) ? files : [files],
	grep: grep,
})
