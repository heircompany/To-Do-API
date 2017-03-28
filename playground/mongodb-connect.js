//const MongoClient = require(`mongodb`).MongoClient;
const {MongoClient, ObjectID} = require(`mongodb`);
//running mongodb locally - start db via CLI
// mongod.exe --dbpath /Users/josep/Programming/mongo-data
let uri = `mongodb://heir:buiLDa#Tr1b3!1@freecluster-shard-00-00-qpwyh.mongodb.net:27017,freecluster-shard-00-01-qpwyh.mongodb.net:27017,freecluster-shard-00-02-qpwyh.mongodb.net:27017/ToDoApp?ssl=true&replicaSet=FreeCluster-shard-0&authSource=admin`;

//use mongodb native driver
MongoClient.connect(`${uri}`, (err, db) => {
  if(err) {
    return console.log(`Cannot connect to MongoDB.`);
  }
  console.log(`Connected to MongoDB.`);

let obj = new ObjectID();
console.log(obj);

// let user = {
//   name: `Joe`,
//   age: 26
// }
// let {name} = user;
// console.log(name);

  // db.collection(`todos`).insertOne({
  //   text: `Something to do`,
  //   completed: false
  // }, (err, result) => {
  //   if(err) {
  //     return console.log(`Cannot add To Do.`, err);
  //   }
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // });
  //
  // db.collection(`todos`).insertOne({
  //   text: `Something else to do`,
  //   completed: false
  // }, (err, result) => {
  //   if(err) {
  //     return console.log(`Cannot add To Do.`, err);
  //   }
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // });

//   db.collection(`users`).insertOne({
//     user: `Joe`,
//     age: 26,
//     location: `Chicago`
//   }, (err, result) => {
//     if(err) {
//       return console.log(`Cannot add User.`, err);
//     }
//     console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2));
//   });
//
//   db.close();
// });
