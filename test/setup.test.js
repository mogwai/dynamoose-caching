const DynamoCache = require('../')
const dynamo = require('../dynamoose')
dynamo.AWS.config.update({
  region: "eu-west-1",
  maxRetries: 20,
})

dynamo.local()

const { test } = require('ava')

const Owner = new dynamo.Schema({
  name: String,
  pets: [String],
})

test('Can setup', t => {
  const OwnerModel = dynamo.model("Owners", Owner)

  OwnerModel.plugin(DynamoCache, {
    operations: ["scan.all", "query"],
    timeout: 3000,
  })

})


exports = module.exports = OwnerModel