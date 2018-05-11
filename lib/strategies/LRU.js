const debug = require('debug')('dynamoose-caching')

module.exports = function (obj) {
  const { model, event } = obj
  const { pluginOptions } = event
  const { operations } = pluginOptions
  if (!operations) {
    // Do all operations
    debug("Adding Caching for all operations")

  }
}


function cacheOperation()