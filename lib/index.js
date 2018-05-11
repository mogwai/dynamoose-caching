const debug = require('debug')('dynamoose-caching')
const { InvalidStrategySelected } = require('./errors')

const Strategy = {
  MEMCACHIER: "MemCachier",
  MEMORY: {
    LRU: "LRU",
  },
}

function setupStrategy(strategy) {
  return require('./strategies/' + strategy)
}

let DynamoCache = function (p, options) {
  p.setName("Dynamoose Caching Plugin")
  p.setDescription("Allows you to use various caching strategies to cache results from dyanmodb")
  const { strategy = Strategy.MEMORY.LRU } = options
  const { model } = p

  p.on("plugin:register", function (obj) {
    try {
      setupStrategy(strategy)(obj);
    } catch (e) {
      throw InvalidStrategySelected
    }
  });

  p.on('init', () => debug("Caching Registered with ", strategy, " strategy"));
}

DynamoCache.Strategy = Strategy

module.exports = DynamoCache

