var mongoose = require('mongoose');
var Todo = mongoose.model('Todo', {
  text: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  }
});

// let newToDo = new toDo({
//      text: `feed puddles`,
// });
//
// newToDo.save().then((doc) => {
//      console.log(`ToDo saved:`);
//      console.log(JSON.stringify(doc, undefined, 2));
// }, (e) => {
//      console.log(`Couldn't save ToDo.`);
// });
//
// let doneToDo = new toDo({
//      text: `find puddles`,
// });
//
// doneToDo.save().then((doc) => {
//      console.log(`ToDo saved:`);
//      console.log(JSON.stringify(doc, undefined, 2));
// }, (e) => {
//      console.log(`Couldn't save ToDo.`);
// });

module.exports = {Todo};
