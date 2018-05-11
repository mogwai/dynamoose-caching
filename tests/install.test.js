const DyanmoCache = require('./lib')

const Owner = new Schema({
  name: String,
  pets: [String],
})

const OwnerModel = dynamoose.model("Owners", Owner)

const CachingStrategy = new DynamoCache({
  strategy: DynamoCache.Strategy.MEMCACHIER,
  username: "Username",
  password: "12345678", // Super secure
  uri: "https://asdas:3000",
  operations: ["scan.all", "query"],
  timeout: 3000,
})

OwnerModel.plugin(CachingStrategy)

exports = module.exports = OwnerModel