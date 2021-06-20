module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	verbose: false,
	setupFilesAfterEnv: ['./test/setup-test-env.js'],
	testPathIgnorePatterns: ['build'],
	globals: {
		'ts-jest': {
			astTransformers: {
				before: [
					{
						path: './adonisTsTransformers.js',
						options: {},
					},
				],
			},
		},
	},
}
