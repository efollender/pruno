"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var pruno = _interopRequire(require(".."));

var livereload = _interopRequire(require("gulp-livereload"));

var Notification = _interopRequire(require("../utils/notification"));

var LiveReloadTask = function LiveReloadTask() {
  var params = arguments[0] === undefined ? {} : arguments[0];
  this.params = params;
};

LiveReloadTask.getDefaults = function () {
  return {
    search: ["::dist/**/*", "./api/**/*"]
  };
};

LiveReloadTask.prototype.generateWatcher = function (gulp, params) {
  livereload.listen();

  return function () {
    gulp.watch(params.search, function () {
      gulp.src(params.search).pipe(livereload()).pipe(new Notification().message("Server Reload Started"));
    });
  };
};

module.exports = pruno.extend(LiveReloadTask);