const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

var data = {
  id: 1729
}

var token = jwt.sign(data, 'NaCl');
console.log(token);

var decoded = jwt.verify(token, 'NaCl');
console.log(decoded);


// var message = 'You are Number 6';
// var hash = SHA256(message).toString();
//
// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);
//
// var data = {
//   id: 4
// };
//
// var token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'NaCl').toString()
// };
//
// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString();
//
// var resultHash = SHA256(JSON.stringify(token.data) + 'NaCl').toString();
//
// if (resultHash === token.hash) {
//   console.log('Data was not fucked with');
// } else {
//   console.log('Data was fucked with. Abort!');
// }
