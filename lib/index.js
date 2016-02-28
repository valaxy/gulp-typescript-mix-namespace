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


const removeDeclare = function (content) {
	return content.replace(/declare/g, '')
}

const convertImport = function (content, file, sourceRoot) {
	return content.replace(/(import.*?from)\s+["'](.*?)['"]/g, function (match, rest, reference) {
		if (reference[0] == '.') {
			var fileAbsolutePath = path.join(file.base, file.relative)
			var fileRelativePathBaseProject = path.relative(file.cwd, fileAbsolutePath)
			var dirRelativePathBaseProject = path.dirname(fileRelativePathBaseProject)
			var moduleName = getModuleNameByRelativePathBaseProject(path.join(dirRelativePathBaseProject, reference + '.d.ts'), sourceRoot)
			return `${rest} ${JSON.stringify(moduleName)}`
		} else {
			return match
		}
	})
}

const getModuleNameByRelativePathBaseProject = function (relativePathBaseProject, sourceRoot) {
	var pathBaseSourceRoot = path.relative(sourceRoot, relativePathBaseProject)
	console.log(pathBaseSourceRoot)
	return pathBaseSourceRoot
		.substr(0, pathBaseSourceRoot.length - '.d.ts'.length)
		.replace(/\\/g, '/')
}

module.exports = ts