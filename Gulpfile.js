'use strict';

var gulp = require('gulp');
var fs = require('fs');
var $ = require('gulp-load-plugins')();

var dist = 'build', host = '67.23.20.217', user = 'jmfcool';

gulp.task('unit', function()
{
	return gulp
		.src(['./assets/js/config/config.js','./assets/lib/**/*.js', './assets/js/*.js', './specs/*.unit.js'])
		.pipe($.jasminePhantom({ integration: true, includeStackTrace: true }));
});

gulp.task('integration', function()
{
	return gulp
		.src(['./assets/js/config/config.js','./assets/lib/**/*.js', './assets/js/*.js', './specs/*.integration.js'])
		.pipe($.jasminePhantom({ integration: true, includeStackTrace: true }));
});

gulp.task('specs', function()
{
	return gulp
		.src(['./assets/js/config/config.js','./assets/lib/**/*.js', './assets/js/*.js', './specs/*.js'])
		.pipe($.jasminePhantom({ integration: true, includeStackTrace: true }));
});

gulp.task('lint', function()
{
	return gulp
		.src(['./*.json','./assets/js/*.js'])
		.pipe($.jshint())
		.pipe($.jshint.reporter('default'));
});

gulp.task('components', function()
{
	return gulp
		.src('./bower.json')
		.pipe($.mainBowerFiles())
		.pipe(gulp.dest('./assets/lib'));
});

gulp.task('scripts', function()
{
	return gulp
		.src(['./assets/js/config/config.js','./assets/lib/**/*.js', './assets/js/*.js'])
		.pipe($.concat('compiled.js'))
		.pipe($.streamify($.uglify()))
		.pipe(gulp.dest(dist+'/js/'));
});

gulp.task('styles', function()
{
	return gulp
		.src(['./assets/lib/**/**/**/**/*.css', './assets/css/*.css'])
		.pipe($.autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9'))
		.pipe($.concat('bundled.css'))
		.pipe($.uglifycss({ 'max-line-len': 80 }))
		.pipe(gulp.dest(dist+'/css/'));
});

gulp.task('templates', function()
{
  return gulp.src('./assets/tpl/*.tpl')
    .pipe($.minifyHtml({ conditionals: true, spare: true }))
    .pipe(gulp.dest(dist+'/tpl/'));
});

gulp.task('images', function()
{
	return gulp
		.src(['./assets/img/*.png', './assets/img/*.jpg', './assets/img/*.gif', './assets/img/*.jpeg'])
		.pipe($.imageOptimization({ optimizationLevel: 5, progressive: true, interlaced: true }))
		.pipe(gulp.dest(dist+'/img/'));
});

gulp.task('watch', function()
{
  gulp.watch(['./assets/js/config/config.js','./assets/lib/**/*.js', './assets/js/*.js'], function()
  {
    gulp.start('scripts');
  });
  gulp.watch(['./assets/lib/**/**/**/**/*.css', './assets/css/*.css'], function()
  {
    gulp.start('styles');
  });
});

function inc(importance)
{
  gulp.start('commit');
  return gulp.src(['./*.json'])
    .pipe($.bump({type: importance}))
    .pipe(gulp.dest('./'))
    .pipe($.git.commit('Update Version'))
    .pipe($.filter('package.json'))
    .pipe($.tagVersion());
}

gulp.task('patch', function() { return inc('patch'); })
gulp.task('feature', function() { return inc('minor'); })
gulp.task('release', function() { return inc('major'); })

gulp.task('commit', function()
{
  gulp.src('package.json')
    .pipe($.prompt.prompt({
      type: 'input',
      name: 'commit',
      message: 'Please enter commit message...'
  },
  function(res)
  {
    return gulp.src(['!node_modules/', '!bower_components/', './*'], { buffer: false })
      .pipe($.git.commit(res.commit))
      .pipe($.git.push('origin', 'master', { args: "--tags" }));
  }));
});

gulp.task('deploy', function()
{
  gulp.src(['./build/**','./index.html','./manifest.json','./server/**'])
    .pipe($.rsync({
      root: './',
      hostname: host,
      destination: '/var/www/jeremiahfaria.com/public/sandbox/incident',
      progress: true,
      clean: true,
      recursive: true
    }));
});

var ssh = new $.ssh({
  ignoreErrors: false,
  sshConfig: {
    host: host,
    port: 22,
    username: user,
    privateKey: fs.readFileSync('/Users/'+user+'/.ssh/id_rsa')
  }
});

gulp.task('server', function ()
{
  if($.util.env.start) return ssh.shell(['cd /var/www/jeremiahfaria.com/public/sandbox/incident/server/','forever start server.js'], {filePath: 'shell.log'}).pipe(gulp.dest('./server/logs'));
  if($.util.env.stop) return ssh.shell(['cd /var/www/jeremiahfaria.com/public/sandbox/incident/server/','forever stop server.js'], {filePath: 'shell.log'}).pipe(gulp.dest('./server/logs'));
  if($.util.env.restart) return ssh.shell(['cd /var/www/jeremiahfaria.com/public/sandbox/incident/server/','forever restart server.js'], {filePath: 'shell.log'}).pipe(gulp.dest('./server/logs'));
});

gulp.task('default', function() {});

if($.util.env.prod)
{
  gulp.task('default', ['deploy']);
}
else
{
  gulp.task('default', ['images','templates','styles','scripts','components','lint','specs']);
}
