const debug = console.log //require('debug')('dynamoose-caching')
const lrucache = require('lru-cache')
const hashO = require('object-hash')
let cache = null

module.exports = function (p, options) {
  const { model, event, plugin } = p
  const { operations } = options
  cache = lrucache(options.lruopts)
  if (!operations) {
    // Do all operations
    debug("Adding Caching for all operations")
    cacheScans(model)
  }
}


function cacheScans(model) {
  const old = model.scan
  model.scan = function () {
    const scan = old.apply(this, arguments)
    const oldexec = scan.exec
    scan.exec = function () {
      const hash = hashO(this.options) + hashO(this.filters)
      if (cache.has(hash)) {
        debug("Cache hit")
        return cache.get(hash)
      }
      const ret = oldexec.apply(this, arguments)
      cache.set(hash, ret)
      debug("Cache missed")
      return ret
    }
    return scan
  }
}