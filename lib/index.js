const debug = require('debug')('dynamoose-caching');
const crypto = require('crypto');
const { InvalidStrategySelected } = require('./errors');

const Strategy = {
  MEMORY: {
    LRU: 'LRU',
  },
};

function getStrategy(strategy) {
  return require('./strategies/' + strategy);
}

let DynamoCache = function(p, options) {
  p.setName('Dynamoose Caching Plugin');
  p.setDescription(
    'Allows you to use various caching strategies to cache results from dyanmodb',
  );
  const {
    strategy = Strategy.MEMORY.LRU,
    operations = { scan: true, query: true, get: true },
    cacheOptions,
  } = options;

  p.on('plugin:register', function(context) {
    try {
      const { model } = context;
      const MainStrat = getStrategy(strategy)(cacheOptions);

      let { scan, get, query } = operations;

      if (scan) {
        debug('Adding Caching for scan operation');
        scan = scan === true ? MainStrat : getStrategy(strategy)(scan);
        cacheOp(model, 'scan', scan);
      }

      if (get) {
        debug('Adding Caching for get operation');
        get = get === true ? MainStrat : getStrategy(strategy)(get);
        cacheGet(model, get);
      }

      if (query) {
        debug('Adding Caching for query operation');
        query = query === true ? MainStrat : getStrategy(strategy)(query);
        cacheOp(model, 'query', query);
      }
    } catch (e) {
      throw new Error(InvalidStrategySelected);
    }
  });

  p.on('init', () => debug('Caching Registered with ', strategy, ' strategy'));
};

function cacheGet(model, cache) {
  const old = model.get;
  model.get = function(key, options) {
    if (options.ignoreCache) return old.apply(this, arguments);

    const hash = hashO(key) + hashO(this.filters);
    if (cache.has(hash)) {
      debug('Cache hit');
      return cache.get(hash);
    }
    const ret = oldexec.apply(this, arguments);
    cache.set(hash);
    debug('Cache missed');
    return ret;
  };
}

function cacheOp(model, optype, cache) {
  const old = model[optype];
  model[optype] = function() {
    const op = old.apply(this, arguments);
    const oldexec = op.exec;
    op.exec = function(ignoreCache) {
      if (ignoreCache) return oldexec.apply(this, arguments);

      const hash = hashO(this.options) + hashO(this.filters);
      if (cache.has(hash)) {
        debug('Cache hit');
        return cache.get(hash);
      }
      const ret = oldexec.apply(this, arguments);
      cache.set(hash, ret);
      debug('Cache missed');
      return ret;
    };
    return op;
  };
}

function hashO(obj) {
  obj = typeof obj === 'string' ? obj : JSON.stringify(obj);
  return crypto
    .createHash('sha1')
    .update(obj)
    .digest('hex');
}

DynamoCache.Strategy = Strategy;

module.exports = DynamoCache;
