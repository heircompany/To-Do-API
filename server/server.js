const express = require(`express`),
const bodyParser = require(`body-parser`),
const  {ObjectID} = require(`mongodb`),
{mongoose} = require(`./db/mongoose`),
{Todo} = require(`./models/todo`),
{User} = require(`./models/user`),

let app = express();
// use local path variable for port, otherwise use port 3000
const port = process.env.PORT || 3000;
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

app.post('/users', (req, res) => {
     let user = new User({
          text: req.body.text
     });

     user.save().then((doc) => {
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
    // error
         // 400 - send empty body back
    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
});

app.listen(port, () => {
  console.log(`Application Launched on port:${port}`);
});

module.exports = {app};
