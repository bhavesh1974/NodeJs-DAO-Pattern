//const _uuid = require("uuid");
const shortid = require("shortid");

exports.generateId = function () {
  return shortid.generate() + '' + shortid.generate();
};