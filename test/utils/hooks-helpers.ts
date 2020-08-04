type AsyncFunction = () => Promise<void>
type TestHooks = {
	before?: AsyncFunction[]
	after?: AsyncFunction[]
	beforeEach?: AsyncFunction[]
	afterEach?: AsyncFunction[]
}

export function registerHooks(
	group,
	{ before = [], after = [], afterEach = [], beforeEach = [] }: TestHooks
) {
	before.forEach((hook) => group.before(hook))
	after.forEach((hook) => group.after(hook))
	beforeEach.forEach((hook) => group.beforeEach(hook))
	afterEach.forEach((hook) => group.afterEach(hook))
}
