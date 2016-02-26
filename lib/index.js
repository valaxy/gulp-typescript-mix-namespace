const through = require('through2')
const path = require('path')
const tsfmt = require('typescript-formatter')


var ts = function (options) {
	options = options || {}
	var sourceRoot = options.sourceRoot || ''

	return through.obj(function (file, encoding, callback) {
		transformFile(file, sourceRoot, (content) => {
			file.contents = new Buffer(content)
			callback(null, file)
		})
	})
}


const transformFile = function (file, sourceRoot, cb) {
	var relativePath = path.relative(file.cwd, file.path)
	var modulePath = getModuleNameByRelativePathBaseProject(relativePath, sourceRoot)

	var content = file.contents.toString()
	content = removePrivate(content)
	content = removeDeclare(content)
	content = convertImport(content, file, sourceRoot)
	content = `
		declare module ${JSON.stringify(modulePath)} {
			${content}
		}
	`

	tsfmt.processString('no-file', content, {}).then((result) => {
		cb(result.dest)
	})
}


const removePrivate = function (content) {
	return content.replace(/private/g, '')
}

const removeDeclare = function (content) {
	return content.replace(/declare/g, '')
}

const convertImport = function (content, file, sourceRoot) {
	return content.replace(/(import.*?from)\s+["'](.*?)['"]/, function (match, rest, reference) {
		var relativePath = path.relative(file.cwd, file.path)
		reference = reference.substr(0, reference - '.d.ts'.length)
		var moduleName = getModuleNameByRelativePathBaseProject(path.join(relativePath, reference), sourceRoot)
		return `${rest} ${JSON.stringify(moduleName)}`
	})
}

const getModuleNameByRelativePathBaseProject = function (relativePath, sourceRoot) {
	var pathBaseSourceRoot = path.relative(sourceRoot, relativePath)
	return pathBaseSourceRoot
		.substr(0, pathBaseSourceRoot.length - '.d.ts'.length)
		.replace(/\\/g, '/')
}

module.exports = ts