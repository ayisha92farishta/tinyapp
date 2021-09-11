
const bcrypt = require("bcrypt");


const generateRandomString = (len) => {
  let p = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return [...Array(len)].reduce(a=>a + p[~~(Math.random() * p.length)],'');
};

const urlsForUser = (id , urlDatabase) => {
  let urlInfo = {};
  for (let urls in urlDatabase) {
    const urlsUser = urlDatabase[urls].userID;
    if (urlsUser === id) {
      urlInfo[urls] = urlDatabase[urls];
    }
  }
  return urlInfo;
};

const getUserWithEmail = (email, users) => {
  for (let id in users) {
    if (users[id].email === email) {
      return users[id];
    }
  }
};

const authenticateUser = (email, password, users) => {
  const user = getUserWithEmail(email, users);
  if (user) {
    if (bcrypt.compareSync(password, user.password)) {
      return user;
    }
  }
};

module.exports = {
  generateRandomString,
  urlsForUser,
  getUserWithEmail,
  authenticateUser
};