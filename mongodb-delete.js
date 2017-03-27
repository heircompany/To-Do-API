//const MongoClient = require(`mongodb`).MongoClient;
const {MongoClient, ObjectID} = require(`mongodb`);
//running mongodb locally - start db via CLI
//mongod.exe --dbpath /Users/josep/Programming/mongo-data
let uri = `mongodb://heir:buiLDa#Tr1b3!1@freecluster-shard-00-00-qpwyh.mongodb.net:27017,freecluster-shard-00-01-qpwyh.mongodb.net:27017,freecluster-shard-00-02-qpwyh.mongodb.net:27017/ToDoApp?ssl=true&replicaSet=FreeCluster-shard-0&authSource=admin`;

//use mongodb native driver
MongoClient.connect(`${uri}`, (err, db) => {
  if(err) {
    return console.log(`Cannot connect to MongoDB.`);
  }
  console.log(`Connected to MongoDB.`);

// db.collection(`users`).deleteMany({user: `Joe`}).then((result) => {
//   console.log(result);
// });

// db.collection(`todos`).deleteOne({text: `Something else to do`}).then((result) => {
//   console.log(result);
// });

// db.collection(`todos`).findOneAndDelete({text: `Something to do`}).then((result) => {
//   console.log(result);
// });

db.collection(`users`).findOneAndDelete({
  _id: new ObjectID(`58d8c3f0d855a524500f2ef2`)
}).then((results) => {
  console.log(JSON.stringify(results, undefined, 2));
});
  //db.close();
});
