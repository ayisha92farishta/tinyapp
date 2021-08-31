const express = require("express");


const app = express();
const PORT = 8080; // default port 8080

app.set('view engine', 'ejs');



const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

function generateRandomString(len) {
  var p = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return [...Array(len)].reduce(a=>a+p[~~(Math.random()*p.length)],'');
}

// reference to ejs files inside the views folder

const bodyparser = require("body-parser");
app.use(bodyparser.urlencoded({extended: true}));

//app.use(express.urlencoded()); //an alternative to the code above


//urls_index
app.get("/urls", (req, res) => {
  const templateVars = { urls : urlDatabase };
  res.render("urls_index", templateVars)
})

app.post("/urls",(req, res) => {
  console.log(req.body);// Log the POST request body to the console
  //res.send("ok");       // Respond with 'Ok'
  const shortURL = generateRandomString(6);
  const data = req.body;
  urlDatabase[shortURL] = data.longURL; // saves data in the url database
  res.redirect(`/urls/${shortURL}`) //redirects user to the new url page
})

//urls_new
app.get("/urls/new",(req, res) => {
  res.render("urls_new")
})

//urls_shows
app.get("/urls/:shortURL",(req, res) => {
 const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]} 
 res.render("urls_shows", templateVars)
})

//redirects user to the longURL
app.get("/u/:shortURL", (req, res) => {
  
  const longURL = urlDatabase[req.params.shortURL];
  
  res.redirect(longURL);
});


//main page
app.get("/", (req, res) => {
  res.send("Hello!");
});

//outputing the urlDatabase in a JSON string
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n")
})


//Turning the server on
app.listen(PORT, () => {
  console.log(`Tiny app listening on port ${PORT}!`);
});
