const test = require('ava');
const DynamoLocal = require('dynamodb-local');
const dynamo = require('dynamoose');
const DynamoCache = require('..');

test.before(async t => (t.context.db = await DynamoLocal.launch(8000)));

test.after(async t => DynamoLocal.stop(t.context.db));

test('Can cache', async t => {
  dynamo.AWS.config.update({
    region: 'local',
    maxRetries: 20,
  });

  dynamo.local();

  const Owner = new dynamo.Schema({
    name: String,
    pets: [String],
  });

  const OwnerModel = dynamo.model('Owners', Owner, {
    create: true,
    update: true,
  });

  try {
    OwnerModel.plugin(DynamoCache, {
      cacheOptions: {
        timeout: 3000,
      },
    });

    let o = new OwnerModel({
      name: 'Harry',
    });
    await o.save();
    const results1 = await OwnerModel.scan()
      .all()
      .exec();
    const results2 = await OwnerModel.scan()
      .all()
      .exec();
    t.is(results1, results2);
  } catch (e) {
    console.log(e.stack);
  }
});
