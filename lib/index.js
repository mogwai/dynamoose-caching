const debug = require('debug')('dynamoose-caching')
const { InvalidStrategySelected } = require('./errors')

const Strategy = {
  // MEMCACHIER: "MemCachier", TODO
  MEMORY: {
    LRU: "LRU",
  },
}

function getStrategy(strategy) {
  return require('./strategies/' + strategy)
}

let DynamoCache = function (p, options) {
  p.setName("Dynamoose Caching Plugin")
  p.setDescription("Allows you to use various caching strategies to cache results from dyanmodb")
  const {
    strategy = Strategy.MEMORY.LRU,
    operations,
  } = options
  const { model } = p

  p.on("plugin:register", function (obj) {
    try {
      getStrategy(strategy)(obj, options);
    } catch (e) {
      throw InvalidStrategySelected
    }
  });

  // if (operations.indexOf("scan.all")) {
  //   p.on("exec:start", ({ event, actions }) => {
  //     const { scan, callback, } = event;
  //   })
  // }


  p.on('init', () => debug("Caching Registered with ", strategy, " strategy"));
}

DynamoCache.Strategy = Strategy

module.exports = DynamoCache

