const express = require("express");
const cookieParser = require("cookie-parser");
const cookieSession = require('cookie-session')
const bcrypt = require("bcrypt");


const app = express();
const PORT = 8080; // default port 8080

app.use(cookieParser())
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],
}))

app.set('view engine', 'ejs');


//Database to store urls

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

function generateRandomString(len) {
  var p = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return [...Array(len)].reduce(a=>a+p[~~(Math.random()*p.length)],'');
}

function urlsForUser(id){
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

// reference to ejs files inside the views folder

const bodyparser = require("body-parser");
app.use(bodyparser.urlencoded({extended: true}));


//--------------------urls_welcome--------------------------------

app.get("/home", (req, res) => {
  const templateVars = { urls : urlDatabase, user_id: users[req.session["user_id"]] };
  res.render("urls_welcome", templateVars)
})



//--------------------urls_index------------------------------


app.get("/urls", (req, res) => {
  const user = users[req.session["user_id"]];
  if(!user){
    return res.send("Please log in")
  }
  
  const filteredURLs = urlsForUser(user.id);

  const templateVars = { urls : filteredURLs, user_id: user };

  res.render("urls_index", templateVars)
})

app.post("/urls",(req, res) => {
   const user_id = users[req.session["user_id"]];

  const shortURL = generateRandomString(6);
  const data = req.body;
  
  urlDatabase[shortURL] = {longURL: data.longURL , userID: user_id.id}  // saves data in the url database 
  console.log(urlDatabase)
  res.redirect(`/urls/${shortURL}`) //redirects user to the new url page
 
})


//-------------------urls_registration -------------------------

app.get("/register", (req, res) => {
  const templateVars = {user_id: users[req.session["user_id"]]}
  res.render("urls_registration",templateVars);
})

app.post("/register", (req, res) => {
  
  const data = req.body;
  const email = data.email;
  
  const password = bcrypt.hashSync(data.password, 10); //Hashed password
  

  //Logic to handle errors

  if(!email || !password){
    return res.status(404).send("Please enter both email and password")
  } 
    

  for(let info in users){
    const userEmail = users[info].email;
    if(email === userEmail) {
     return res.status(404).send("This email already exists. Please login or use another email.")
   } 
  }

  // If no errors then register new user 
  const randomUserID = generateRandomString(8);
  users[randomUserID]= {id:randomUserID, email, password }
  //res.cookie('user_id', randomUserID);
  req.session["user_id"] = randomUserID;

  console.log(users)
  
  res.redirect("/urls");
});



//---------------urls_new---------------------
app.get("/urls/new",(req, res) => {
  const templateVars = {user_id: users[req.session["user_id"]]}
  res.render("urls_new", templateVars);
})



//-------------------urls_login----------------
  //handles login and logout requests

app.get("/login", (req, res) => {
  const templateVars = {user_id: users[req.session["user_id"]]};
  res.render("urls_login",templateVars);
})

app.post("/login", (req, res) => {

  
  const {email, password} = req.body;



  //console.log(" login password", data.password)
  // const password = bcrypt.compareSync(data.password, by); //Hashed password
  // console.log( "hashedPassword ----",  password)
  //Logic to handle errors

  if(!email || !password){
    return res.status(404).send("Please enter both email and password")
  }; 
    
  const user = authenticateUser(email, password, users)

  if(user) {
    req.session["user_id"] = user.id;
    return res.redirect("/urls");
  } else {
    return res.status(403).send("Please enter correct password and email");
  }

  // // for (let info in users) {
  // //   const userEmail = users[info].email;
  // //   const userPassword = users[info].password;
  // //   const user_id = users[info].id;
  // //   console.log("userPassword -------",userPassword);

    
  //   if(email === userEmail && bcrypt.compareSync(data.password, userPassword)) {      
  //     //res.cookie('user_id', user_id );
  //     req.session["user_id"] = user_id;
  //     return res.redirect("/urls");
      
  //   } else if (email === userEmail && password!== userPassword){
  //    return res.status(403).send("Please enter correct password");
      
  //   };
     
  //  } 

  //  return res.status(403).send("Looks like there is no account registered with that email!")



});



app.post("/logout", (req,res) => {
  //res.clearCookie('user_id');
  req.session = null;
  res.redirect("/home")
})




//-------------------urls_shows-------------------------
app.get("/urls/:shortURL",(req, res) => {
  const user = users[req.session["user_id"]];
  if(!user){
    return res.send("Please log in");
  }
  
  if(user.id !== urlDatabase[req.params.shortURL].userID){
    return res.send("Url is under different user");
  }

 const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], user_id: user} 
 res.render("urls_shows", templateVars)
})

app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const data = req.body;
  const user_id = users[req.session["user_id"]];
  urlDatabase[shortURL] = {longURL: data.longURL , userID: user_id.id}; //overwrites the long url under the existing short url
  res.redirect("/urls")
})

  //redirects user to the longURL
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  if(!longURL){
   return res.status(404).send("Not found! Url not valid.");
  }  
  res.redirect(longURL);
});

  //post route in correspondence with the delete form in urls_index.ejs
app.post("/urls/:shortURL/delete", (req, res) => {
  
  const user = users[req.session["user_id"]];
  
  if(!user){
    return res.send("Please log in");
  }
  const shortURL = req.params.shortURL;
 
  delete urlDatabase[shortURL];
  
  res.redirect("/urls")
})

  //post route in correspondence with the edit form in urls_index.ejs
app.post("/urls/:shortURL/edit", (req, res) => {
  const user = users[req.session["user_id"]];
  if(!user){
    return res.send("Please log in");
  }
  const shortURL = req.params.shortURL;
  res.redirect(`/urls/${shortURL}`)
})


//Turning the server on
app.listen(PORT, () => {
  console.log(`Tiny app listening on port ${PORT}!`);
});
