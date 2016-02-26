const tsfmt = require('typescript-formatter')

tsfmt.processString('xx', `
	class A {
	private    a;
	}
`, {}).then((result) => {
	console.log(result)
})