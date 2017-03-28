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

  let obj = `58d8ba7e5ebd38376804eb74`

  db.collection(`todos`).find().count().then((count) => {
    console.log(`To Do's: ${count}`);
  }, (err) => {
    console.log(`Cannot fetch To Dos.`, err);
  });

    db.collection(`todos`).find({
      _id: new ObjectID(obj)
    }).toArray().then((docs) => {
      console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
      console.log(`Cannot fetch To Dos.`, err);
    });

    db.collection(`users`).find({user: `Joe`}).toArray().then((docs) => {
      console.log(JSON.stringify(docs, undefined, 2));
    });

  //db.close();
});
