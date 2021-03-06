"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var child_process = _interopRequire(require("child_process"));

var merge = _interopRequire(require("deepmerge"));

var tinyLr = _interopRequire(require("tiny-lr"));

var lr = tinyLr();

module.exports = (function () {
  var service = null,
      defaultOptions = {
    env: "development",
    file: "app.js",
    port: 35729
  };

  var livereload = {
    start: function (port) {
      lr.listen(port);
    },
    reload: function (fileName) {
      lr.changed({ body: { files: [fileName] } });
    }
  };
  return {
    run: function (newOptions) {
      var options = merge(defaultOptions, newOptions || {});

      if (service) {
        service.kill("SIGKILL");
        service = undefined;
      } else {
        livereload.start(options.port);
      }

      process.env.DIST = options.dist;
      process.env.NODE_ENV = options.env;

      if (options.args == undefined) {
        service = child_process.spawn("node", ["--harmony", options.file], {
          NODE_ENV: options.env
        });
      } else {
        var args = options.args;
        args.push("--harmony");
        args.push(options.file);
        service = child_process.spawn("node", args, {
          NODE_ENV: options.env
        });
      }


      service.stdout.setEncoding("utf8");
      service.stderr.setEncoding("utf8");
      service.stdout.on("data", function (data) {
        console.log(data.trim());
      });
      service.stderr.on("data", function (data) {
        console.log(data.trim());
      });
      service.on("exit", function (code, sig) {
        console.log("service process exit ... ", code, sig);
      });
      process.on("exit", function (code, sig) {
        console.log("main process exit ... ", code, sig);
        service.kill();
      });

      return service;
    },
    notify: function (event) {
      var fileName = require("path").relative(__dirname, event.path);
      livereload.reload(fileName);
    }
  };
})();