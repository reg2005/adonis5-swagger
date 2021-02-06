export default {
	appKey: '______________fake_app_secret______________',
	http: {
		trustProxy() {
			return true
		},
		cookie: {},
	},
	logger: {
		name: 'testApp',
		enabled: true,
		level: 'info',
		prettyPrint: true,
	},
}
