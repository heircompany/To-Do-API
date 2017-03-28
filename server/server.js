require(`./config/config`);
const express = require(`express`);
const bodyParser = require(`body-parser`);
const _ = require(`lodash`);

const {ObjectID} = require(`mongodb`);
const {mongoose} = require(`./db/mongoose`);
const {Todo} = require(`./models/todo`);
const {User} = require(`./models/user`);
const {authenticate} = require(`./middleware/authenticate`);

let app = express();

const port = process.env.PORT;
app.use(bodyParser.json());

// ALL TO DO'S
app.get('/todos', authenticate, (req, res) => {
     Todo.find({
          _creator: req.user._id
     }).then((todos) => {
          res.send({todos});
     }, (e) => {
          res.status(400).send(e);
     });
});

// CREATE TO DO
app.post('/todos', authenticate, (req, res) => {
     let todo = new Todo({
          text: req.body.text,
          _creator: req.user._id
     });

     todo.save().then((doc) => {
          res.send(doc);
     }, (e) => {
          res.status(400).send(e);
     });
});

// READ TO DO
app.get('/todos/:id', authenticate, (req, res) => {
  let id = req.params.id;
  // check ID validity
       // 404 if not
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  // find ID
  // success
       // if todo - send it back
       // if no todo - send back 404 with empty body
  Todo.findOne({
       _id: id,
       _creator: req.user._id
 }).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }
      res.send({todo});
      // error
         // 400 - send empty body back
  }).catch((e) => {
    res.status(400).send();
  });
});

// UPDATE TO DO
app.patch(`/todos/:id`, authenticate, (req, res) => {
     let id = req.params.id;
     // pick values user can edit
     let body = _.pick(req.body, [`text`, `completed`]);

     if (!ObjectID.isValid(id)) {
          return res.status(404).send();
     }
     //check if values are Boolean and get Date/Time stamps
     if (_.isBoolean(body.completed) && body.completed) {
          body.completedAt = new Date().getTime();
     } else {
          // set completed to false
          body.completed = false;
          //set completed at to blank value
          body.completedAt = null;
     }
     Todo.findOneAndUpdate({
          _id: id,
          _creator: req.user._id
     }, {$set: body}, {new: true}).then((todo) => {
          if (!todo) {
               return res.status(404).send();
          }
          res.send({todo});
     }).catch((e) => {
          res.status(400).send();
     });
});

// DELETE TO DO
app.delete(`/todos/:id`, authenticate, (req, res) => {
     // check ID validity
          // 404 if not
     let id = req.params.id;
     if (!ObjectID.isValid(id)) {
          return res.status(404).send();
     }
     // find ID
     // success
          // if todo - send it back with 200
          // if no todo - send back 404 with empty body
     Todo.findOneAndRemove({
          _id: id,
          _creator: req.user._id
     }).then((todo) => {
          if (!todo) {
            return res.status(404).send();
          }
     res.send({todo});
     // error
         // 400 - send empty body back
    }).catch((e) => {
      res.status(400).send();
    });
});

// READ CURRENT USER
app.get('/users/me', authenticate, (req, res) => {
     res.send(req.user);
});

// CREATE NEW USER
app.post('/users', (req, res) => {
     let body = _.pick(req.body, [`email`, `password`]);
     let user = new User(body);
     //instance method on user - user.generateAuthToken
     user.save().then(() => {
          return user.generateAuthToken();
     }).then((token) => {
          //custom header for JWT schema
          res.header(`x-auth`, token).send(user);
     }).catch((e) => {
          res.status(400).send(e);
     });
});

// USER LOGIN
app.post('/users/login', (req, res) => {
     let body = _.pick(req.body, [`email`, `password`]);
     User.findByCredentials(body.email, body.password).then((user) => {
          return user.generateAuthToken().then((token) => {
               res.header(`x-auth`, token).send(user);
          });
     }).catch((e) => {
          res.status(400).send();
     });
});

// DELETE USER TOKEN BEFORE LOGOUT
app.delete(`/users/me/token`, authenticate, (req, res) => {
     req.user.removeToken(req.token).then(() => {
          res.status(200).send();
     }, () => {
          res.status(400).send();
     });
});

// START SERVER
app.listen(port, () => {
  console.log(`Application Launched on port:${port}`);
});

module.exports = {app};
