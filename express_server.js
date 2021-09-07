const express = require("express");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");


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
    password: "asd"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "zxc"
  }
}

function generateRandomString(len) {
  var p = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return [...Array(len)].reduce(a=>a+p[~~(Math.random()*p.length)],'');
}


// reference to ejs files inside the views folder

const bodyparser = require("body-parser");
app.use(bodyparser.urlencoded({extended: true}));


//--------------------urls_index------------------------------


app.get("/urls", (req, res) => {
  const templateVars = { urls : urlDatabase, user_id: users[req.cookies["user_id"]] };
  res.render("urls_index", templateVars)
})

app.post("/urls",(req, res) => {
  const shortURL = generateRandomString(6);
  const data = req.body;
  const user_id = users[req.cookies["user_id"]];
  urlDatabase[shortURL] = data.longURL // saves data in the url database 
  console.log(urlDatabase)
  res.redirect(`/urls/${shortURL}`) //redirects user to the new url page
 //{longURL: data.longURL , userID: user_id}
})

//main page
app.get("/", (req, res) => {
  res.send("Hello!");
});

//-------------------urls_registration -------------------------

app.get("/register", (req, res) => {
  const templateVars = {user_id: users[req.cookies["user_id"]]}
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
    const userEmail = users[info].email;
    if(email === userEmail) {
     return res.status(404).send("This email already exists. Please login or use another email.")
   } 
  }

  // If no errors then register new user 
  const randomUserID = generateRandomString(8);
  users[randomUserID] = data;
  users[randomUserID].id = randomUserID;
  res.cookie('user_id', randomUserID);
  
  //console.log(users)
  
  res.redirect("/urls");
});



//---------------urls_new---------------------
app.get("/urls/new",(req, res) => {
  const templateVars = {user_id: users[req.cookies["user_id"]]}
  res.render("urls_new", templateVars);
})



//-------------------urls_login----------------
  //handles login and logout requests

app.get("/login", (req, res) => {
  const templateVars = {user_id: users[req.cookies["user_id"]]};
  res.render("urls_login",templateVars);
})

app.post("/login", (req, res) => {

  const data = req.body;
  const email = data.email;
  const password = data.password;

  //Logic to handle errors

  if(!email || !password){
    return res.status(404).send("Please enter both email and password")
  }; 
    
  for (let info in users) {
    const userEmail = users[info].email;
    const userPassword = users[info].password;
    const user_id = users[info].id;
    //console.log(userEmail);

    
    if(email === userEmail && password === userPassword) {      
      res.cookie('user_id', user_id );
      res.redirect("/urls");
    } else if (email === userEmail && password !== userPassword){
      res.status(403).send("Please enter correct password")
    };
     
   } 

  res.status(403).send("Looks like there is no account registered with that email!")

});



    // if(email !== userEmail) {
    //     return res.status(403).send("Looks like there is no account registered with that email!")
    // } 


app.post("/logout", (req,res) => {
  res.clearCookie('user_id');
  res.redirect("/urls")
})






//-------------------urls_shows-------------------------
app.get("/urls/:shortURL",(req, res) => {
 const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], user_id: users[req.cookies["user_id"]]} 
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
