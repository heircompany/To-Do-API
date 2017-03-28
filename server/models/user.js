const mongoose = require(`mongoose`);
const validator = require(`validator`);
const jwt = require(`jsonwebtoken`);
const _ = require(`lodash`);

let UserSchema = new mongoose.Schema({
     email: {
          type: String,
          required: true,
          minlength: 1,
          trim: true,
          unique: true,
          validate: {
               validator: validator.isEmail,
               message: `{VALUE} is not a valid email`
          }
     },
     password: {
          type: String,
          required: true,
          minlength: 6
     },
     tokens: [{
          access: {
               type: String,
               required: true
          },
          token: {
               type: String,
               required: true
          }
     }]
});

//INSTANCE METHODS
UserSchema.methods.toJSON = function () {
     let user = this;
     let userObject = user.toObject();

     return _.pick(userObject, [`_id`, `email`]);
};

UserSchema.methods.generateAuthToken = function() {
     let user = this;
     let access = `auth`;
     let token = jwt.sign({_id: user._id.toHexString(), access}, `silly puddles`).toString();

     user.tokens.push({access, token});
     return user.save().then(() => {
          return token;
     });
};

//MODEL METHODS
UserSchema.statics.findByToken = function(token) {
     let User = this;
     let decoded;

     try {
          decoded = jwt.verify(token, `silly puddles`);
     } catch (e) {
          // return new Promise((resolve, reject) => {
          //      reject();
          // });
          //easier version!
          return Promise.reject();
     }
     return User.findOne({
          "_id": decoded._id,
          "tokens.token": token,
          "tokens.access": "auth"
     });
};

let User = mongoose.model(`User`, UserSchema);

// // let user = new User({
// //      email: `joegrotto@heir.company`
// // });
//
// user.save().then((doc) => {
//      console.log(`User saved:`);
//      console.log(JSON.stringify(doc, undefined, 2));
// }, (e) => {
//      console.log(`Couldn't save User.`);
// });

module.exports = {User};
