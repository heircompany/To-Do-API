const {ObjectID} = require(`mongodb`);
const {mongoose} = require(`./../server/db/mongoose`);
const {Todo} = require(`./../server/models/todo`);
const {User} = require(`./../server/models/user`);

// Todo.remove({}).then((result) => {
//      console.log(result);
// });

// Todo.findOneAndRemove(_id: `58da007f587c5c2fa06c241f`).then((todo) => {
//      console.log(todo);
// });

Todo.findByIdAndRemove(`58da007f587c5c2fa06c241f`).then((todo) => {
     console.log(todo);
});
