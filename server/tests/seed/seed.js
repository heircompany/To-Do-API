const jwt = require(`jsonwebtoken`);
const {ObjectID} = require(`mongodb`);
const {Todo} = require(`./../../models/todo`);
const {User} = require(`./../../models/user`);

const todos = [{
     _id: new ObjectID(),
     text: "first todo test",
     completed: true,
     completedAt: 333
}, {
     _id: new ObjectID(),
     text: "second todo test",
     completed: false
}];

const userIdOne = new ObjectID();
const userIdTwo = new ObjectID();
const users = [{
     _id: userIdOne,
     email: `joegrotto@heir.company`,
     password: `P@ssw0rd1`,
     tokens: [{
          access: `auth`,
          token: jwt.sign({_id: userIdOne, access: `auth`}, `silly puddles`).toString()
     }]
}, {
     _id: userIdTwo,
     email: `joeyg@heir.company`,
     password: `P@ssw0rd2`,
}];

const populateTodos = (done) => {
     Todo.remove({}).then(() => {
          return Todo.insertMany(todos);
     }).then(() => done());
};

const populateUsers = (done) => {
     User.remove({}).then(() => {
          let userOne = new User(users[0]).save();
          let userTwo = new User(users[1]).save();

          return Promise.all([userOne, userTwo]);
     }).then(() => done());
};

module.exports = {todos, populateTodos, users, populateUsers};
