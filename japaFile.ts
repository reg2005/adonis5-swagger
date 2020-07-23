require('ts-node').register({
	files: true,
})

const { configure } = require('japa')
configure({
	files: ['test/**/*.spec.ts'],
	before: [
		async () => {
			// await require('fs-extra').copy('./test-assets', './test/__app/build/test-assets')
		},
	],
	after: [
		async () => {
			await require('fs-extra').remove(require('path').join(__dirname, 'tmp'))
		},
	],
})
