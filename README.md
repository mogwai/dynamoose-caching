# Dynamoose Plugin - Caching

Currently support LRU in memory caching for dynamodb scans, queries and gets

`npm i dynamoose-caching`

## Usage

```js
const Owner = new dynamo.Schema({
  name: String,
  pets: [String],
})
const OwnerModel = dynamo.model("Owners", Owner)
OwnerModel.plugin(require('dynamoose-caching'))
```

## Override single operation

This will ignore cache operation

```js
let results = await OwnerModel.scan().exec(true)
let results = await OwnerModel.query().exec(true)
```

Similary for .get()

```js
let owner = await OwnerModel.get("Jim", { ignoreCache: true} )
```

