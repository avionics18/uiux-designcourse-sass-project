// Initialize Modules
const { src, dest, watch, series } = require("gulp");
const mode = require("gulp-mode")();
const sourcemaps = require("gulp-sourcemaps");
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const cssnano = require("cssnano");
const browsersync = require("browser-sync").create();

// Sass Task
function scssTask() {
	return src('src/scss/style.scss')
		.pipe(mode.development(sourcemaps.init()))
		.pipe(sass())
		.pipe(mode.production(postcss([cssnano()])))
		.pipe(mode.development(sourcemaps.write()))
		.pipe(dest('public/css'));
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
	console.log("gulp.development() - ", mode.development("sample"));
	watch('public/*.html', bsReload);
	watch(
		['src/scss/**/*.scss'],
		series(scssTask, bsReload)
	);
}

// Export Gulp Tasks
let workflow;
if(mode.development()) {
	workflow = series(
		scssTask,
		bsServe,
		watchTask
	);
} else {
	workflow = series(scssTask);
}

exports.default = workflow;