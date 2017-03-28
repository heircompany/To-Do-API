const {SHA256} = require(`crypto-js`);
const jwt = require(`jsonwebtoken`);
const bcrypt = require(`bcryptjs`);

let password = `123abc!`;
bcrypt.genSalt(10, (err, salt) => {
     bcrypt.hash(password, salt, (err, hash) => {
          console.log(hash);
     });
});

let hashedPassword = `$2a$10$fEpOiyAecnswsPhojllhBu1j3nkI7em2qR9aknHXqQmvEfa6LGJ0y`;
bcrypt.compare(password, hashedPassword, (err, res) => {
     console.log(res);
});

// let data = {
//      id: 10
// };
//
// // sign object and create hash, return token value
// let token = jwt.sign(data, `somesecret$`);
// console.log(token);
//
// // check for data manipulation
// let decoded = jwt.verify(token, `somesecret$`);
// console.log(`decoded:`, decoded);

// let message = `I am user number 3`;
// let hash = SHA256(message).toString();
//
// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);

// let data = {
//      id: 4
// };
//
// let token = {
//      data,
//      hash: SHA256(JSON.stringify(data) + `somesecret`).toString()
// };
//
// // hack attempts that alter another user's info - test
// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString();
//
// // therefore, add salt to hashing!
// let resultHash = SHA256(JSON.stringify(token.data) + `somesecret`).toString();
// if (resultHash === token.hash) {
//      console.log(`Data not changed.`);
// } else {
//      console.log(`Data changed, do not trust!`);
// };
