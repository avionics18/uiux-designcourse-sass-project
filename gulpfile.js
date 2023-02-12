// Initialize Modules
const { src, dest, watch, series } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const cssnano = require("cssnano");
const browsersync = require("browser-sync").create();

// Sass Task
function scssTask() {
	return src('src/scss/style.scss', { sourcemaps: true })
		.pipe(sass())
		.pipe(postcss([cssnano()]))
		.pipe(dest('public/css', { sourcemaps: '.' }));
}

// BrowserSync
function bsServe(cb) {
	browsersync.init({
		server: {
			baseDir: './public',
		},
		notify: {
			styles: {
				top: 'auto',
				bottom: '0',
			},
		},
	});

	cb();
}

function bsReload(cb) {
	browsersync.reload();
	cb();
}


// ===GULP WORKFLOW===
// Watch Task
function watchTask() {
	watch('public/*.html', bsReload);
	watch(
		['src/scss/**/*.scss'],
		series(scssTask, bsReload)
	);
}

// Default Gulp Task
exports.default = series(
	scssTask,
	// bsServe,
	// watchTask
);