const test = require('ava');
const DynamoLocal = require('dynamodb-local');
const dynamo = require('dynamoose');
const DynamoCache = require('..');

dynamo.AWS.config.update({ region: 'local' });
dynamo.local();

test.before(async t => {
  t.context.db = await DynamoLocal.launch(8000);
  const Schema = new dynamo.Schema({
    name: String,
    pets: [String],
    secondName: {
      type: String,
      index: {
        global: true,
        name: 'secondName',
      },
    },
  });

  const Model = dynamo.model('Model', Schema, {
    create: true,
    update: true,
  });

  Model.plugin(DynamoCache, {
    cacheOptions: {
      timeout: 3000,
    },
  });

  t.context.Model = Model;
});

test.afterEach(async t => {
  const Model = t.context.Model;
  const models = await Model.scan()
    .all()
    .exec();
  if (models.length) await Model.batchDelete(models);
});

test.after(async t => DynamoLocal.stop(t.context.db));

test.serial('Scan operation caches values', async t => {
  const Model = t.context.Model;
  let o = new Model({ name: 'Linus' });
  await o.save();
  const results1 = await Model.scan()
    .all()
    .exec();
  o.name = 'changed';
  await o.save();
  const results2 = await Model.scan()
    .all()
    .exec();
  t.is(results1[0].name, results2[0].name);
});

test.serial('Get operation caches values', async t => {
  const Model = t.context.Model;
  let o = new Model({ name: 'Linus' });
  await o.save();
  const results1 = await Model.get('Linus');
  o.name = 'changed';
  await o.save();
  const results2 = await Model.get('Linus');
  t.is(results1.name, results2.name);
});

test.serial('Query operation caches values', async t => {
  function query() {
    return Model.query('secondName')
      .eq('Torvalds')
      .exec();
  }
  const Model = t.context.Model;
  let o = new Model({ name: 'Linus', secondName: 'Torvalds' });
  await o.save();
  const results1 = await query();
  o.secondName = 'changed';
  await o.save();
  const results2 = await query();
  t.is(results1.secondName, results2.secondName);
});
