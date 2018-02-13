const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// var id = '5a81fc8c3904901fccb396b111';
//
// if (!ObjectID.isValid(id)) {
//   console.log(`ID ${id} is not valid`);
// }

// Todo.find({
//   _id: id
// }).then((todos) => {
//   console.log('Todos', todos);
// });
//
// Todo.findOne({
//   _id: id
// }).then((todo) => {
//   console.log('Todo', todo);
// });

// Todo.findById(id).then((todo) => {
//   if (!todo) {
//     return console.log('Id not found');
//   }
//   console.log('Todo by id', todo);
// }).catch((e) => console.log(e));

var id = '5a7ce45ba4f1965358ce3c8f';

User.find({
  _id: id
}).then((users) => {
  console.log('Users', users);
});

User.findOne({
  _id: id
}).then((user) => {
  console.log('User findOne', user);
});

User.findById(id).then((user) => {
  if (!user) {
    return console.log('Id not found');
  }
  console.log('User by id', user);
}).catch((e) => console.log(e));
