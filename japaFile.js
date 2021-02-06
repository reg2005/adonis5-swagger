const { configure } = require('japa')
const { argv } = require('yargs')

const { files = ['test/**/*.spec.ts'], grep } = argv

configure({
	files: Array.isArray(files) ? files : [files],
	grep: grep,
})
