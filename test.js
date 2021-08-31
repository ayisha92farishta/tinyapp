// function generateRandomString() {
// return Math.random().toString(36).substr(2, 6);
// }

// console.log(generateRandomString())

// //Array.from(Array(6), () => Math.floor(Math.random() * 36).toString(36)).join('');


function randomString(len) {
  var p = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return [...Array(len)].reduce(a=>a+p[~~(Math.random()*p.length)],'');
}

console.log(randomString(6))

