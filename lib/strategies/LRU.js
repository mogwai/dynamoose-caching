const debug = require('debug')('dynamoose:plugin:caching');
const LRU = require('lru-cache');

module.exports = function(p, options) {
  debug('LRU Cache created');
  debug(options);
  return new LRU(options);
};
