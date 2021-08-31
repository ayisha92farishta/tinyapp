const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set('view engine', 'ejs');

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// reference to ejs files inside the views folder

//urls_index
app.get("/urls", (req, res) => {
  const templateVars = { urls : urlDatabase };
  res.render("urls_index", templateVars)
})

//urls_new
app.get("/urls/new",(req, res) => {
  res.render("urls_new")
})

//urls_shows
app.get("/urls/:shortURL",(req, res) => { m 
 const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]} 
 res.render("urls_shows", templateVars)
})


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
