const urlDatabase = {
  // b6UTxQ: { longURL: "https://www.tsn.ca", userID: "userRandomID" },
  // i3BoGr: { longURL: "https://www.google.ca", userID: "userRandomID" }
};

// Database to store user information

const users = {
  // 'userRandomID': {
  //   id: "userRandomID", 
  //   email: "user@example.com", 
  //   password: "asd"
  // },
  // "user2RandomID": {
  //   id: "user2RandomID", 
  //   email: "user2@example.com", 
  //   password: "zxc"
  // }
}

const generateRandomString = (len) => {
  var p = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return [...Array(len)].reduce(a=>a+p[~~(Math.random()*p.length)],'');
}

const urlsForUser = (id) => {
  let urlInfo = {}  
  for(let urls in urlDatabase){
    const urlsUser = urlDatabase[urls].userID;
    if(urlsUser === id){
     urlInfo[urls] = urlDatabase[urls]
   }
  }
  return urlInfo;
}

const getUserWithEmail = (email, users) => {
  for(let id in users){
    if(users[id].email === email) {
      return users[id];
    }
  }
}

const authenticateUser = (email, password, users) => {
  const user = getUserWithEmail(email, users);
  if (user) {
    if(bcrypt.compareSync(password, user.password)){
      return user
    }
  }
}

module.exports = {
  generateRandomString,
  urlsForUser,
  getUserWithEmail,
  authenticateUser
}