const express = require(`express`);
const bodyParser = require(`body-parser`);
const {mongoose} = require(`./db/mongoose`);
const {Todo} = require(`./models/todo`);
const {User} = require(`./models/user`);

// use local path variable for port, otherwise use port 3000
const port = process.env.PORT || 3000;
let app = express();
app.use(bodyParser.json());

app.get('/todos', (req, res) => {
     Todo.find().then((todos) => {
          res.status(200).send({todos});
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

app.listen(port, () => {
  console.log(`Application Launched on port:${port}`);
});

module.exports = {app};
