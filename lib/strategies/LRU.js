const debug = require("debug")("dynamoose-caching");
const lrucache = require("lru-cache");

module.exports = function(p, options) {
  const { model, event, plugin } = p;
  const { operations } = options;
  return lrucache;
};
