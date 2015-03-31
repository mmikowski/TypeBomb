var
  gulp      = require('gulp'),
  gp_concat = require('gulp-concat'),
  gp_rename = require('gulp-rename'),
  gp_uglify = require('gulp-uglify')
  ;

//  gulp.task('scripts', ['clean'], function() {
//    // Minify and copy all JavaScript (except vendor scripts) 
//    // with sourcemaps all the way down 
//    return gulp.src(paths.scripts)
//      .pipe(sourcemaps.init())
//        .pipe(coffee())
//        .pipe(uglify())
//        .pipe(concat('all.min.js'))
//      .pipe(sourcemaps.write())
//      .pipe(gulp.dest('build/js'));
//  });
 
gulp.task('zz', function(){
  var 
    child_process = require('child_process'),
    ret_val;

  var ret_val = gulp.src([
    'js/third_party/jquery.event.gevent.js',
    'js/tb.js',
    'js/tb.css.js',
    'js/tb.model.js',
    'js/tb.model.data.js',
    'js/tb.shell.js',
  ]).pipe(gp_concat('concat.js'))
    .pipe(gulp.dest('./dist'))
    .pipe(gp_rename('uglify.js'))
    .pipe(gp_uglify('app.min.js'), { mangle: true, outSourceMap : true })
    .pipe(gulp.dest('./dist'))
    ;

  //  if ( ! ret_val ) { process.exit( 1 ); }
  //
  //  ret_val = child_process.spawnSync(
  //    'superpack -i ./dist/app.min.js -o ./dist/app.sp.js -l ./dist/app.sp.log'
  //  )

  // process.exit( 0 );
});

gulp.task('default', function(){});

