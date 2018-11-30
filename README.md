# Dynamoose Plugin - Caching

Currently support LRU in memory caching for dynamodb scans, queries and gets

`npm i dynamoose-caching`

## Quick Start

```js
const Owner = new dynamo.Schema({
  name: String,
  pets: [String],
})
const OwnerModel = dynamo.model("Owners", Owner)
OwnerModel.plugin(require('dynamoose-caching'))
```

### Override single operation

This will ignore cache operation

```js
let results = await OwnerModel.scan().exec(true)
let results = await OwnerModel.query().exec(true)
```

Similary for .get()

```js
let owner = await OwnerModel.get("Jim", { ignoreCache: true} )
```


## Strategies

### LRU (Default)

Least Recently Used items caches. 

Please read the [documentation](https://github.com/isaacs/node-lru-cache#options) for how to configure the cache 


## Roadmap

Would like to use this pattern to allow specific queries to be cached instead of whole operations: 

`model.scan().all().exec().cache()`

Or to ignore:

`model.scan().all().exec().ignoreCache()`

#### Feature Ideas

- Passing an object into the plugin options that allows the user to manage the various caches and clear them.
- Having the option to make operations share a cache
- Specific a hashing function to use for the LRU Caching strategy
- MemCache Strategy Implementation

