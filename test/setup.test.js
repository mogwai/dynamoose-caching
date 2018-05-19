const DynamoCache = require('../')

const dynamo = require('../dynamoose')
dynamo.AWS.config.update({
  region: "local",
  maxRetries: 20,
})

dynamo.local()

const Owner = new dynamo.Schema({
  name: String,
  pets: [String],
})

const OwnerModel = dynamo.model("Owners", Owner, { create: true, update: true, })

async function main() {
  try {
    OwnerModel.plugin(DynamoCache, {
      operations: ["scan", ""],
      timeout: 3000,
    })

    let o = new OwnerModel({
      name: "Harry"
    })
    await o.save()
    let results = await OwnerModel.scan().all().exec()
    results = await OwnerModel.scan().all().exec()
    debug
  } catch (e) {
    console.log(e.stack)
  }
}

main()