# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly) in just a few simple steps!

## Final Product
!["Welcome Page"](./images/Welcome.png?raw=true  "Welcome to TinyApp!");
!["Register Page"](./images/Register.png?raw=true  "Create an account")
!["Index Page"](./images/Index.png?raw=true  "And store all the urls under your account safely!")

## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session

## Getting Started

- Install all dependencies mentioned under 'dependencies' in the package.json file (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.

## The TinyApp Experience

-Create an account by signing up with an email and a password.
-Then you are free to start generating you own unique short urls.
-Once you are done and have signed off you can login with the same user name and password ('this time by signing in) and voila! Your urls are there just the way you left them!
-How ever since it's database is inside the server once the server restarts all data is lost. And you get to start a fresh!
-Enjoy!
