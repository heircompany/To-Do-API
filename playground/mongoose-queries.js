const {ObjectID} = require(`mongodb`);
const {mongoose} = require(`./../server/db/mongoose`);
const {Todo} = require(`./../server/models/todo`);
const {User} = require(`./../server/models/user`);

// let id = `58d9f10729392e0424f93a0721`;
//
// if (!ObjectID.isValid(id)) {
//      console.log(`id not valid`);
// };

// Todo.find({
//      _id: id
// }).then((todos) => {
//      console.log(`todos`, todos);
// });
//
// Todo.findOne({
//      _id: id
// }).then((todo) => {
//      console.log(`todo`, todo);
// });
//
// Todo.findById(id).then((todo) => {
//      if (!todo) {
//           return console.log(`ID not found`)
//      }
//      console.log(`todo by id`, todo);
// }).catch((e) => console.log(e));

User.findById(`58d9f5807b2f5a17ecf3c539`).then((user) => {
     if (!user) {
          return console.log(`user not found`);
     }
     console.log(JSON.stringify(user, undefined, 2));
}, (e) => {
     console.log(e);
});
