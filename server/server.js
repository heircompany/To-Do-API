const    express = require(`express`);
const    bodyParser = require(`body-parser`);
let {mongoose} = require(`./db/mongoose`);
let {Todo} = require(`./db/mongoose`);
let {User} = require(`./db/mongoose`);

// use local path variable for port, otherwise use port 3000
const port = process.env.PORT || 3000;
let app = express();
app.use(bodyParser.json());

// app.get('/', (req, res) => {
//      res.send(req.body);
// });

app.post('/todo', (req, res) => {
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
