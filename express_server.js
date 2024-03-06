const express = require("express");
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");
app.use(cookieParser());

//Initial url database
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//User database
const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

//Generate a random character string 6 charcters long
const generateRandomString = function(idLength) {
  const possibleChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const charLength = possibleChars.length;
  const length = idLength;
  let result = '';

  for (let i = 0; i < length; i++) {
    result += possibleChars.charAt(Math.floor(Math.random() * charLength));
  }
  return result;
};

//Find a user by their email address
const getUserByEmail = function(users, email) {
  let foundUser = {};

  for (const user in users) {
    if (email === users[user].email) {
      foundUser = users[user];
    }
  }

  return foundUser;
};

app.use(express.urlencoded({ extended: true }));

// -- GETS --

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

//Render url database
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase, users: users, id: req.cookies["user_id"] };
  res.render("urls_index", templateVars);
});

//Render submit new url page
app.get("/urls/new", (req, res) => {
  const templateVars = { urls: urlDatabase, users: users, id: req.cookies["user_id"] };
  res.render("urls_new", templateVars);
});

//Render the new user registration page
app.get("/register", (req, res) => {
  const templateVars = { urls: urlDatabase, users: users, id: req.cookies["user_id"] };
  res.render("register", templateVars);
});

//Render the login page
app.get("/login", (req, res) => {
  const templateVars = { urls: urlDatabase, users: users, id: req.cookies["user_id"] };
  res.render("login", templateVars);
});

//Render the page showing long url and its short url
app.get("/urls/:id", (req, res) => {
  //req.params.id is the short url
  const templateVars = {
    longURL: urlDatabase[req.params.id],
    users: users,
    id: req.cookies["user_id"]
  };

  res.render("urls_show", templateVars);
});

//Redirect to the long url (id is the short url)
app.get("/u/:id", (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id];

  //Check if id exists in url database. Display error if it doesn't. Redirect if it does
  if (!urlDatabase[id]) {
    res.send(`<html><body>ERROR! Shor URL ${id} doesn't exist</b></body></html>\n`);
  } else
    res.redirect(longURL);
});

// -- POSTS --

//Post the newly added long and short urls to the database
app.post("/urls", (req, res) => {
  //Create short url
  const shortURL = generateRandomString(6);
  //Get long url from the request body
  let longURL = req.body.longURL;

  //If the user didn't add http:// or https://, add http
  const httpRegex = /^http:\/\//;
  const httpsRegex = /^https:\/\//;

  if (!httpRegex.test(longURL) && !httpsRegex.test(longURL)) {
    longURL = "http://" + longURL;
  }

  //Save short and long url mapping
  urlDatabase[shortURL] = longURL;

  //Redirect to the new URL's page
  res.redirect(`/urls/${shortURL}`);
});

//Remove a url from the database
app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id;
  delete urlDatabase[id];

  //Redirect back to the index page
  res.redirect("/urls");
});

//Edit a long url in the database
app.post("/urls/:id", (req, res) => {
  const id = req.params.id;
  const longURL = req.body.longURL;

  //Save the edited url into the database
  urlDatabase[id] = longURL;

  res.redirect("/urls");
});

//Handle user log in input
app.post("/login", (req, res) => {
  const email = req.body.email.trim();
  const password = req.body.password.trim();
  const checkUser = getUserByEmail(users, email);

  if (checkUser.email === email && checkUser.password === password) {
    res.cookie("user_id", checkUser.id);
    res.redirect("/urls");
  } else {
    res.status(403).send("Email and password don't match");
  }
});

//Clear cookie when user logs out
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");

  res.redirect("/login");
});

//Handle user registration data
app.post("/register", (req, res) => {
  const email = req.body.email.trim();
  const password = req.body.password.trim();
  const checkUser = getUserByEmail(users, email);
  
  //Validate email and password
  if (email === "" || password === "") {
    res.status(400).send("Cannot leave email or password blank!");
    //Check if email exists in the users database
  } else if (checkUser.email === email) {
    res.status(400).send("Email already exists! Cannot use duplicate email.");
    //If doesn't exist, add new user to database
  } else {
    //Generate user ID and set in cookie
    const id = generateRandomString(12);
    res.cookie("user_id", id);

    users[id] = {
      id: id, email: email, password: password
    };

    res.redirect("/urls");
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});