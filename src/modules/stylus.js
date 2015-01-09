import pruno from '..';
import path from 'path';
import Notification from '../utils/notification';
import getType from '../utils/getType';
import pkg from '../utils/pkg';
import loadPlugins from 'gulp-load-plugins';
import streamqueue from 'streamqueue';
import fs from 'fs';

var plugins = loadPlugins();

class StylusTask {
  constructor(params) {
    this.params = params;
  }

  static getDefaults() {
    return {
      'entry': '::src/stylus/index.styl',
      'dist': '::dist/stylesheets/app.css',
      'search': '::src/**/*.styl',
      'minify': false,
      'source-maps':true,
      'font-awesome': false,
      'normalize': false,
      'use': ['nib', 'jeet', 'rupture']
    };
  }

  enqueue(gulp, params = {}) {
    var [dist, distDir, fileName] = params.dist.match(/^(.+\/)(.+\.css)$/);

    var opts = {};

    if (params['source-maps']) {
      opts.sourcemap = {
        inline: true,
        sourceRoot: '.'
      }
    }

    if (params.use && getType(params.use) === 'array') {
      opts.use = params.use.map(m => {
        return require(m)();
      });
    }

    var stream = streamqueue({objectMode: true});

    stream.pipe(
      plugins.if(
        params['source-maps'],
        plugins.sourcemaps.init({loadMaps: true})
      )
    );

    if (params.normalize) {
      stream.queue(
        gulp.src(pkg('normalize.css', 'normalize.css'))
      );
    }
    if (params['font-awesome']) {
      stream.queue(
        gulp.src(pkg('font-awesome', 'css/font-awesome.css'))
      );
    }

    stream.queue(
      gulp.src(params.entry)
        .pipe(plugins.stylus(opts))
    );

    return stream.done()
      .pipe(plugins.concat(fileName))
      .pipe(plugins.if(params.minify, plugins.minifyCss()))
      .pipe(plugins.if(params['source-maps'], plugins.sourcemaps.write()))
      .pipe(gulp.dest(distDir))
      .pipe(new Notification().message('Stylus Compiled!'));
  }

  generateWatcher(gulp, params) {
    return true;
  }
}

export default pruno.extend(StylusTask);