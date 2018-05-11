const debug = require('debug')('dynamoose-caching')

const Strategy = {
  MEMCACHIER: "MemCachier",
  MEMORY: {
    LRU: "LRU",
  },
}

let DynamoCache = function (p, options) {
  p.setName("Dynamoose Caching Plugin")
  p.setDescription("Allows you to use various caching strategies to cache results from dyanmodb")
  const { strategy } = options
  const { model } = p

  p.on("plugin:register", function (obj) {
    if (strategy === Strategy.MEMORY.LRU) {
      
    } else {

    }
  });
  p.on('init', () => debug("Caching Registered with ", strategy, " strategy"))


}

DynamoCache.Strategy = Strategy

module.exports = DynamoCache

