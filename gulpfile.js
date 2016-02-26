const gulp = require('gulp')
const ts = require('./lib/index')

gulp.task('default', function () {
	gulp.src('test/**/*.d.ts')
		.pipe(ts())
		.pipe(gulp.dest('dest/'))
})

