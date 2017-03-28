const mongoose = require(`mongoose`);
const validator = require(`validator`);
const jwt = require(`jsonwebtoken`);
const _ = require(`lodash`);
const bcrypt = require(`bcryptjs`);

// USER SCHEMA
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

//MONGOOSE MIDDLEWARE
UserSchema.pre(`save`, function (next) {
     let user = this;
     if (user.isModified(`password`)) {
          bcrypt.genSalt(10, (err, salt) => {
               bcrypt.hash(user.password, salt, (err, hash) => {
                    user.password = hash;
                    next();
               });
          });
     } else {
          next();
     }
});

let User = mongoose.model(`User`, UserSchema);

module.exports = {User};
