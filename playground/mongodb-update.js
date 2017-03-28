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

// db.collection(`todos`).findOneAndUpdate({
//      _id: new ObjectID(`58d8c191d855a524500f2ee9`)
// }, {
//      $set: {
//           completed: true
//      }
// }, {
//      returnOriginal: false
// }).then((result) => {
//      console.log(result);
// });

db.collection(`users`).findOneAndUpdate({
     _id: new ObjectID(`58d8c4e9d855a524500f2ef4`)
}, {
     $set: {
          user: `Joe`
     },
     $inc: {
          age: -1
     }
}, {
     returnOriginal: false
}).then((result) => {
     console.log(result);
});



  //db.close();
});
