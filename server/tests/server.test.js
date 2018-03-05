const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateTodos);
beforeEach(populateUsers);

describe('POST /todos', () => {
  it('Should create a new todo', (done) => {
    var text = 'Test todo again';

    request(app)
      .post('/todos')
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

  it('Should handle invalid todo request', (done) => {
    var text = '';

    request(app)
      .post('/todos')
      .send({text})
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

describe('GET /todos', () => {
  it('Should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });
});

describe('GET /todos/:id', () => {
  it('Should return todo doc', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it('Should return 404 if todo not found', (done) => {
    var id = new ObjectID();
    request(app)
      .get(`/todos/${id.toHexString()}`)
      .expect(404)
      .end(done);
  });

  it('Should return 400 for invalid object id', (done) => {
    request(app)
      .get('/todos/011235')
      .expect(400)
      .end(done);
  });
});


describe('DELETE /todos/:id', () => {
  it('Should remove a todo', (done) => {
    var hexId = todos[1]._id.toHexString();

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

  it('Should return 404 if todo not found', (done) => {
    var hexId = new ObjectID().toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .expect(404)
      .end(done);
  });

  it('Should return 400 if object id is invalid', (done) => {
    request(app)
      .delete('/todos/011235')
      .expect(400)
      .end(done);
  });
});

describe('PATCH /todo/:id', () => {
  it('Should update todo', (done) => {
    var hexId = todos[0]._id.toHexString();

    request(app)
      .patch(`/todos/${hexId}`)
      .send({ text: 'Doctor who?', completed: true})
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe('Doctor who?');
        expect(res.body.todo.completedAt).toBeA('number');
      })
      .end(done);

  });

  it('Should clear completedAt when todo is not completed', (done) => {
    var hexId = todos[1]._id.toHexString();

    request(app)
      .patch(`/todos/${hexId}`)
      .send({ text: 'The First Question', completed: false })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe('The First Question');
        expect(res.body.todo.completed).toBe(false)
        expect(res.body.todo.completedAt).toNotExist();
      })
      .end(done);

  });
});

describe('GET /users/me', () => {
  it('Should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('Should return 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body._id).toNotExist();
        expect(res.body.email).toNotExist();
      })
      .end(done);
  });
});

describe('POST /users', () => {

  it('Should create a new user', (done) => {
    var email = 'thedoctor@tardis.com';
    var password = 'basicallyrun';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(email);
      })
      .end((err) => {
        if (err) {
          return done(err);
        }

        User.findOne({email}).then((user) => {
          expect(user).toExist();
          expect(user.password).toNotBe(password);
          done();
        });
      });
  });

  it('Should return validation errors if request invalid', (done) => {
    var email = 'thedoctor_tardis.com';
    var password = '12345';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end(done);

  });

  it('Should not create user with duplicate email', (done) => {

    var email = 'thedoctor@tardis.com';
    var password = 'basicallyrun';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end(done);

  });
});
