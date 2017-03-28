const expect = require(`expect`);
const request = require(`supertest`);

const {ObjectID} = require(`mongodb`);
const {app} = require(`./../server`);
const {Todo} = require(`./../models/todo`);
const {User} = require(`./../models/user`);
const {todos, populateTodos, users, populateUsers} = require(`./seed/seed`);

beforeEach(populateUsers);
beforeEach(populateTodos);

describe(`POST /todos`, () => {
     it(`should create a new ToDo`, (done) => {
          let text = `ToDo Test`;
          request(app)
               .post(`/todos`)
               .send({text})
               .expect(200)
               .expect((res) => {
                    expect(res.body.text).toBe(text);
               })
               .end((err, res) => {
                    if (err) {
                         return done(err);
                    }
                    Todo.find({text}).then((todos) => {
                         expect(todos.length).toBe(1);
                         expect(todos[0].text).toBe(text);
                         done();
                    }).catch((e) => done(e));
               });
     });

     it(`should halt ToDo creation with bad data`, (done) => {
          request(app)
               .post(`/todos`)
               .send({})
               .expect(400)
               .end((err, res) => {
                    if (err) {
                         return done(err);
                    }
                    Todo.find().then((todos) => {
                         expect(todos.length).toBe(2);
                         done();
                    }).catch((e) => done(e));
               });
     });
});

describe(`GET /todos`, () => {
     it(`should get all todos`, (done) => {
          request(app)
               .get(`/todos`)
               .expect(200)
               .expect((res) => {
                    expect(res.body.todos.length).toBe(2);
               })
               .end(done);
     });
});

describe(`GET /todos/:id`, () => {
     it(`should get a todo`, (done) => {
          request(app)
          //convert object  to string
               .get(`/todos/${todos[0]._id.toHexString()}`)
               .expect(200)
               .expect((res) => {
                    expect(res.body.todo.text).toBe(todos[0].text);
               })
               .end(done);
     });

     it(`should return 404 when todo not found`, (done) => {
          //create new hex id aka string from object id
          let hexId = new ObjectID().toHexString();
          request(app)
               .get(`/todos/${hexId}`)
               .expect(404)
               .end(done);
     });

     it(`should return 404 for invalid object query`, (done) => {
          request(app)
               .get(`/todos/sillyandrewmead`)
               .expect(404)
               .end(done);
     });
});

     describe(`DELETE /todos/:id`, () => {
          it(`should remove a todo`, (done) => {
               let hexId = todos[1]._id.toHexString();
               request(app)
                    .delete(`/todos/${hexId}`)
                    .expect(200)
                    .expect((res) => {
                         expect(res.body.todo._id).toBe(hexId);
                    })
                    .end((err, res) => {
                         if (err) {
                              return done(err);
                         }
                         Todo.findById(hexId).then((todo) => {
                              expect(todo).toNotExist();
                              done();
                    }).catch((e) => done(e));
               });
          });

          it(`should return 404 if todo isn't found`, (done) => {
               //create new hex id aka string from object id
               let hexId = new ObjectID().toHexString();
               request(app)
                    .delete(`/todos/${hexId}`)
                    .expect(404)
                    .end(done);
          });

          it(`should return 404 for invalid object query`, (done) => {
               request(app)
                    .delete(`/todos/sillyandrewmead`)
                    .expect(404)
                    .end(done);
          });
     });

     describe(`PATCH /todos/:id`, () => {
          it(`should update a todo`, (done) => {
               //grab todo id
               let hexId = todos[0]._id.toHexString();
               let text = `new text from patching`;
               //update text, set completed to true
               request(app)
                    .patch(`/todos/${hexId}`)
                    .send({
                         completed: true,
                         text
                    })
                    .expect(200)
               //text updated, completed true, completedAt is number
               .expect((res) => {
                    expect(res.body.todo.text).toBe(text);
                    expect(res.body.todo.completed).toBe(true);
                    expect(res.body.todo.completedAt).toBeA(`number`);
               })
               .end(done);
          });

          it(`should clear completedAt when todo is not completed`, (done) => {
               //grab todo id
               let hexId = todos[1]._id.toHexString();
               let text = `more new text from patching`;
               //update text, set completed to false
               request(app)
                    .patch(`/todos/${hexId}`)
                    .send({
                         completed: false,
                         text
                    })
                    .expect(200)
               //text updated, completed false, completedAt is null
               .expect((res) => {
                    expect(res.body.todo.text).toBe(text);
                    expect(res.body.todo.completed).toBe(false);
                    expect(res.body.todo.completedAt).toNotExist();
               })
               .end(done);
          });
     });

     describe(`GET /users/me`, () => {
          it(`should return user to authenticated user`, (done) => {
               request(app)
               .get(`/users/me`)
               // get custom header, grab first ID and first token
               .set(`x-auth`, users[0].tokens[0].token)
               .expect(200)
               .expect((res) => {
                    // check user id, convert to string and validate
                    expect(res.body._id).toBe(users[0]._id.toHexString());
                    // check user email and validate
                    expect(res.body.email).toBe(users[0].email);
               })
               .end(done);
          });

          it(`should return 401 to unauthenticated user`, (done) => {
               request(app)
               .get(`/users/me`)
               // get custom header, grab first ID and first token
               // no token
               .expect(401)
               .expect((res) => {
                    // validate response is empty
                    expect(res.body).toEqual({});
               })
               .end(done);
          });
     });

     describe(`POST /users`, () => {
          it(`should create user`, (done) => {
               let email = `example@example.com`;
               let password = `puddles`;
               request(app)
               .post(`/users`)
               .send({email, password})
               .expect(200)
               .expect((res) => {
                    expect(res.headers[`x-auth`]).toExist();
                    expect(res.body._id).toExist();
                    expect(res.body.email).toBe(email);
               })
               .end((err) => {
                    if (err) {
                         return done (err);
                    }
                    User.findOne({email}).then((user) => {
                         expect(user).toExist();
                         expect(user.password).toNotBe(password);
                         done();
                    }).catch((e) => done(e));
               });
          });

          it(`should return validation errors during signup`, (done) => {
               request(app)
               .post(`/users`)
               .send({
                    email: `wrong`,
                    password: `pw`
               })
               .expect(400)
               .end(done);
          });

          it(`should notify user if email is in use`, (done) => {
               request(app)
               .post(`/users`)
               .send({
                    email: users[0].email,
                    password: `P@ssw0rd1`
               })
               .expect(400)
               .end(done);
          });
     });

     describe(`POST /users/login`, () => {
          it(`should validate user credentials, login and return auth token`, (done) => {
               request(app)
                    .post(`/users/login`)
                    .send({
                         email: users[1].email,
                         password: users[1].password
                    })
                    .expect(200)
                    .expect((res) => {
                         expect(res.headers[`x-auth`]).toExist();
                    })
                    .end((err, res) => {
                         if (err) {
                              return done(err);
                         }
                         User.findById(users[1]._id).then((user) => {
                              expect(user.tokens[0]).toInclude({
                                   access: `auth`,
                                   token: res.headers[`x-auth`]
                              });
                              done();
                         }).catch((e) => done(e));
                    });
          });

          it(`should reject invalid login`, (done) => {
               request(app)
                    .post(`/users/login`)
                    .send({
                         email: users[1].email,
                         password: users[1].password +`1`
                    })
                    .expect(400)
                    .expect((res) => {
                         expect(res.headers[`x-auth`]).toNotExist();
                    })
                    .end((err, res) => {
                         if (err) {
                              return done(err);
                         }
                         User.findById(users[1]._id).then((user) => {
                              expect(user.tokens.length).toBe(0);
                              done();
                         }).catch((e) => done(e));
                    });
          });
     });

     describe(`DELETE/users/me/token`, () => {
          it(`should remove auth token and logout`, (done) => {
               request(app)
                    .delete(`/users/me/token`)
                    .set(`x-auth`, users[0].tokens[0].token)
                    .expect(200)
                    .end((err, res) => {
                         if (err) {
                              return done(err);
                         }
                         User.findById(users[0]._id).then((user) => {
                              expect(user.tokens.length).toBe(0);
                              done();
                         }).catch((e) => done(e));
                    });
          });
     });
