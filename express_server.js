const express = require("express");
const cookieParser = require("cookie-parser");


const app = express();
const PORT = 8080; // default port 8080

app.use(cookieParser())
app.set('view engine', 'ejs');


//Database to store urls

const urlDatabase = {
};

// Database to store user information

const users = {
  'userRandomID': {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}

function generateRandomString(len) {
  var p = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return [...Array(len)].reduce(a=>a+p[~~(Math.random()*p.length)],'');
}

function isLoggedIn(req, res, next) {
  return req.isAuthenticated();
}

// reference to ejs files inside the views folder

const bodyparser = require("body-parser");
app.use(bodyparser.urlencoded({extended: true}));


//--------------------urls_index------------------------------


app.get("/urls", (req, res) => {
  const templateVars = { urls : urlDatabase, username: users[req.cookies["user_id"]] };
  res.render("urls_index", templateVars)
})

app.post("/urls",(req, res) => {
  const shortURL = generateRandomString(6);
  const data = req.body;
  urlDatabase[shortURL] = data.longURL; // saves data in the url database
  res.redirect(`/urls/${shortURL}`) //redirects user to the new url page

})

//main page
app.get("/", (req, res) => {
  res.send("Hello!");
});

//-------------------urls_registration -------------------------

app.get("/register", (req, res) => {
  const templateVars = {username: users[req.cookies["user_id"]]}
  res.render("urls_registration",templateVars);
})

app.post("/register", (req, res) => {
  
  const data = req.body;
  const email = data.email;
  const password = data.password;

  //Logic to handle errors

  if(!email || !password){
    return res.status(404).send("Please enter both email and password")
  } 
    
  for(let info in users){
    
    //console.log(users[info].email)
    const userEmail = users[info].email;
    console.log(userEmail);
   if(email === userEmail) {
     return res.status(404).send("This email already exists. Please login or use another email.")
   } 
  }

  // If no errors then register new user 
  const randomUserID = generateRandomString(8);
  users[randomUserID] = data;
  res.cookie('user_id', randomUserID);

  
  res.redirect("/urls");
});



//---------------urls_new---------------------
app.get("/urls/new",(req, res) => {
  const templateVars = {username: users[req.cookies["user_id"]]}
  //console.log(templateVars.username)
  res.render("urls_new", templateVars);
})




  //handles login and logout requests
app.post("/login", (req, res) => {
    const username = users[req.cookies["user_id"]]
    //res.cookie('username', username);
    res.redirect("/urls")
});

app.post("/logout", (req,res) => {
  res.clearCookie('user_id');
  res.redirect("/urls")
})






//-------------------urls_shows-------------------------
app.get("/urls/:shortURL",(req, res) => {
 const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], username: users[req.cookies["user_id"]]} 
 res.render("urls_shows", templateVars)
})

app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const data = req.body;
  urlDatabase[shortURL] = data.longURL; //overwrites the long url under the existing short url
  res.redirect("/urls")
})

  //redirects user to the longURL
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  if(!longURL){
   return res.status(404).send("Not found! Url not valid.");
  }  
  res.redirect(longURL);
});

  //post route in correspondence with the delete form in urls_index.ejs
app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  //res.send("Deleted")
  res.redirect("/urls")
})

  //post route in correspondence with the edit form in urls_index.ejs
app.post("/urls/:shortURL/edit", (req, res) => {
  const shortURL = req.params.shortURL;
  res.redirect(`/urls/${shortURL}`)
})



// //outputing the urlDatabase in a JSON string
// app.get("/urls.json", (req, res) => {
//   res.json(urlDatabase);
// });

// app.get("/hello", (req, res) => {
//   res.send("<html><body>Hello <b>World</b></body></html>\n")
// })


//Turning the server on
app.listen(PORT, () => {
  console.log(`Tiny app listening on port ${PORT}!`);
});
