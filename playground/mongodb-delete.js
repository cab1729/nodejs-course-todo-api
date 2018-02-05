//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  // deleteMany
  // db.collection('Todos').deleteMany({text: 'quit shit job'}).then((result) => {
  //   console.log(result);
  // });
  // db.collection('Users').deleteMany({name: 'cab1729'}).then((result) => {
  //   console.log(result);
  // });

  // deleteOne
  // db.collection('Todos').deleteOne({text: 'quit shit job'}).then((result) => {
  //   console.log(result);
  // });
  // findOneAndDelete
  // db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
  //   console.log(result);
  // });
  db.collection('Users')
    .findOneAndDelete({_id: new ObjectID('5a78d15d2b30b0ffdcff55b1')})
    .then((result) => {
    console.log(result);
  });

  //db.close();
});
