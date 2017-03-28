const mongoose = require(`./db/mongoose`);
let User = mongoose.model(`User`, {
     email: {
          type: String,
          required: true,
          minlength: 1,
          trim: true
     }//,
     // password: {
     //      type: String,
     //      required: true,
     //      minlength: 1,
     //      trim: true
     // },
     // createdDate: {
     //      type: Date
     //      default:
     // }
});

let user = new User({
     email: `joegrotto@heir.company`
});

user.save().then((doc) => {
     console.log(`User saved:`);
     console.log(JSON.stringify(doc, undefined, 2));
}, (e) => {
     console.log(`Couldn't save User.`);
});

module.exports = {User};
