var gulp        = require('gulp'),
    $           = require('gulp-load-plugins')(),
    path        = require('path'),
    browserSync = require('browser-sync'),
    through2    = require('through2'),
    reload      = browserSync.reload,
    browserify  = require('browserify'),
    argv        = require('yargs').argv,
    runSequence = require('run-sequence');

gulp.task('browser-sync', function() {
  browserSync({
    open: !!argv.open,
    notify: !!argv.notify,
    server: {
      baseDir: "./dist"
    }
  });
});

gulp.task('sass', function () {
  return gulp.src('./src/stylesheets/**/*.{scss,sass}')
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      includePaths: [
        path.join(__dirname, 'node_modules/normalize.css')
      ]
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe($.cssnano())
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('dist/stylesheets'));
});


gulp.task('mainjs', function() {
  return gulp.src('src/scripts/main/*.js')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe(through2.obj(function (file, enc, next) {
      browserify(file.path, { debug: true })
        .transform(require('babelify'))
        .transform(require('debowerify'))
        .bundle(function (err, res) {
          if (err) { return next(err); }
          file.contents = res;
            next(null, file);
        });
      }))
      .on('error', function (error) {
        console.log(error.stack);
        this.emit('end')
    })
    .pipe($.if(argv.production, $.uglify()))
    .pipe( $.rename('main.js'))
    .pipe($.sourcemaps.write())
    .pipe( gulp.dest('dist/scripts/'));
});

gulp.task('sitebreakerjs', function() {
  return gulp.src('src/scripts/sitebreaker/*.js')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe(through2.obj(function (file, enc, next) {
      browserify(file.path, { debug: true })
        .transform(require('babelify'))
        .transform(require('debowerify'))
        .bundle(function (err, res) {
          if (err) { return next(err); }
          file.contents = res;
            next(null, file);
        });
      }))
      .on('error', function (error) {
        console.log(error.stack);
        this.emit('end')
    })
    .pipe($.if(argv.production, $.uglify()))
    .pipe( $.rename('sitebreaker.js'))
    .pipe($.sourcemaps.write())
    .pipe( gulp.dest('dist/scripts/'));
});


gulp.task('clean', function(cb) {
  return gulp.src('./dist', {read: false})
    .pipe($.clean());
});

gulp.task('images', function() {
  return gulp.src('./src/images/**/*')
    .pipe($.imagemin({
      progressive: true
    }))
    .pipe(gulp.dest('./dist/images'))
})

gulp.task('templates', function() {
  return gulp.src('src/*.jade')
    .pipe($.plumber())
    .pipe($.jade({
      pretty: true,
      locals: {
        prod: argv.production
      }
    }))
    .pipe( gulp.dest('dist/') )
});

gulp.task('favicon', function() {
  return gulp.src('src/favicon.ico')
    .pipe($.copy('dist/', {
      prefix: 1
    }));
})

gulp.task('build', function(callback) {
  runSequence(
    'clean',
    ['sass', 'mainjs', 'sitebreakerjs', 'templates', 'images', 'favicon'],
    callback);
});

gulp.task('serve', ['build', 'browser-sync'], function () {
  gulp.watch('src/stylesheets/**/*.{scss,sass}',['sass', reload]);
  gulp.watch('src/scripts/main/**/*.js',['mainjs', reload]);
  gulp.watch('src/scripts/sitebreaker/**/*.js',['sitebreakerjs', reload]);
  gulp.watch('src/images/**/*',['images', reload]);
  gulp.watch('src/*.jade',['templates', reload]);
});

gulp.task('default', ['serve']);

gulp.task('deploy', function() {
  return gulp.src('./dist/**/*')
    .pipe($.ghPages());
});
