"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var pruno = _interopRequire(require(".."));

var yamlConfig = _interopRequire(require("yaml-env-config"));

var ConfigureTask = function ConfigureTask(params) {
  var config = yamlConfig(params.dir, { absolute: true });
  pruno.setDefaults(config.pruno);
};

module.exports = pruno.extend(ConfigureTask);