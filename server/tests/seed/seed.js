const jwt = require(`jsonwebtoken`);
const {ObjectID} = require(`mongodb`);
const {Todo} = require(`./../../models/todo`);
const {User} = require(`./../../models/user`);

const userIdOne = new ObjectID();
const userIdTwo = new ObjectID();
const users = [{
     _id: userIdOne,
     email: `joegrotto@heir.company`,
     password: `P@ssw0rd1`,
     tokens: [{
          access: `auth`,
          token: jwt.sign({_id: userIdOne, access: `auth`}, process.env.JWT_SECRET).toString()
     }]
}, {
     _id: userIdTwo,
     email: `joeyg@heir.company`,
     password: `P@ssw0rd2`,
     tokens: [{
          access: `auth`,
          token: jwt.sign({_id: userIdTwo, access: `auth`}, process.env.JWT_SECRET).toString()
     }]
}];

const todos = [{
     _id: new ObjectID(),
     text: "first todo test",
     completed: true,
     completedAt: 333,
     _creator: userIdOne
}, {
     _id: new ObjectID(),
     text: "second todo test",
     completed: false,
     _creator: userIdTwo
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
