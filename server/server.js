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

app.get('/todos', (req, res) => {
     Todo.find().then((todos) => {
          res.send({todos});
     }, (e) => {
          res.status(400).send(e);
     });
});

app.post('/todos', (req, res) => {
     let todo = new Todo({
          text: req.body.text
     });

     todo.save().then((doc) => {
          res.send(doc);
     }, (e) => {
          res.status(400).send(e);
     });
});

app.get('/todos/:id', (req, res) => {
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
  Todo.findById(id).then((todo) => {
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

app.delete(`/todos/:id`, (req, res) => {
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
     Todo.findByIdAndRemove(id).then((todo) => {
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

app.patch(`/todos/:id`, (req, res) => {
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
     Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
          if (!todo) {
               return res.status(404).send();
          }
          res.send({todo});
     }).catch((e) => {
          res.status(400).send();
     });
});

app.get('/users/me', authenticate, (req, res) => {
     res.send(req.user);
});

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

app.listen(port, () => {
  console.log(`Application Launched on port:${port}`);
});

module.exports = {app};
