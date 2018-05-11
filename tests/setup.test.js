const DyanmoCache = require('../')
const dynamoose = require('../dynamoose')
const { test } = require('ava')

const Owner = new dynamoose.Schema({
  name: String,
  pets: [String],
})

test('Can setup', t => {
  const OwnerModel = dynamoose.model("Owners", Owner)

  OwnerModel.plugin(DyanmoCache, {
    strategy: DynamoCache.Strategy.MEMCACHIER,
    username: "Username",
    password: "12345678", // Super secure
    uri: "https://asdas:3000",
    operations: ["scan.all", "query"],
    timeout: 3000,
  })
})


exports = module.exports = OwnerModel