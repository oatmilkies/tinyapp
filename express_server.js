const express = require("express");
const cookieParser = require('cookie-parser');
const bcrypt = require("bcryptjs");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");
app.use(cookieParser());

//Initial url database
const urlDatabase = {
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    userID: "userRandomID",
  },
  "9sm5xK": {
    longURL: "http://www.google.com",
    userID: "userRandomID",
  }
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

//Create a list of urls for a logged in user
const urlsForUserID = function(urls, id) {
  const urlList = {};

  for (const key in urls) {
    if (urls[key].userID === id) {
      urlList[key] = urls[key].longURL;
    }
  }

  return urlList;
};

//Check if a short url is accessible to a user
const checkURL = function(userList, database, shortURL, id) {
  let found = false;

  for (const key in userList) {
    if (Object.keys(userList).includes(shortURL) && database[key].userID === id) {
      found = true;
    }
  }
  return found;
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


//Render submit new url page
app.get("/urls/new", (req, res) => {
  const templateVars = { urls: urlDatabase, users: users, id: req.cookies["user_id"] };

  if (req.cookies["user_id"]) {
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/login");
  }
});


//Render list of short and long urls for the user logged in
app.get("/urls", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    users: users,
    id: req.cookies["user_id"],
    userURLs: urlsForUserID(urlDatabase, req.cookies["user_id"])
  };

  if (req.cookies["user_id"]) {
    res.render("urls_index", templateVars);
  } else {
    res.send("You must be logged in to view URLs");
  }
});


//Render the page showing long url and its short url
app.get("/urls/:id", (req, res) => {
  //req.params.id is the short url

  if (!urlDatabase[req.params.id]) {
    res.send("URL does not exist in the database");
  } else {
    const templateVars = {
      shortURL: req.params.id,
      longURL: urlDatabase[req.params.id].longURL,
      users: users,
      id: req.cookies["user_id"]
    };

    const userURLs = urlsForUserID(urlDatabase, templateVars.id);
    //Make sure shortURL belongs to the logged in user
    if (checkURL(userURLs, urlDatabase, templateVars.shortURL, templateVars.id)) {
      res.render("urls_show", templateVars);
    } else {
      res.send("Cannot view a URL that does not belong to you!");
    }
  }
});


//Redirect to the long url (id is the short url)
app.get("/u/:id", (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id].longURL;
  const userURLs = urlsForUserID(urlDatabase, req.cookies["user_id"]);

  //Check if user is logged in
  if (!req.cookies["user_id"]) {
    res.send("You must be logged in to view the URLS");
    //Make sure shortURL belongs to the logged in user
  } else if (!checkURL(userURLs, urlDatabase, id, req.cookies["user_id"])) {
    res.send("Cannot view a URL that does not belong to you!");
    //Check if shortURL is in the database
  } else if (!urlDatabase[id]) {
    res.send(`<html><body>ERROR! Short URL ${id} doesn't exist</b></body></html>\n`);
  } else
    res.redirect(longURL);
});


// -- POSTS --


//Remove a url from the database
app.post("/urls/:id/delete", (req, res) => {
  //id is shortURL
  const id = req.params.id;
  const userURLs = urlsForUserID(urlDatabase, req.cookies["user_id"]);

  if (!req.cookies["user_id"]) {
    res.send("You must be logged in to delete a URL!");
  } else if (!checkURL(userURLs, urlDatabase, id, req.cookies["user_id"])) {
    res.send("Cannot delete a URL that does not belong to you!");
    //Delete the database entry
  } else {
    delete urlDatabase[id];
    res.redirect("/urls");
  }
});

//Edit a long url in the database
app.post("/urls/:id", (req, res) => {
  //id is shortURL
  const id = req.params.id;
  const longURL = req.body.longURL;
  const userURLs = urlsForUserID(urlDatabase, req.cookies["user_id"]);

  if (!req.cookies["user_id"]) {
    res.send("You must be logged in!");
  } else if (!checkURL(userURLs, urlDatabase, id, req.cookies["user_id"])) {
    res.send("Cannot edit a URL that does not belong to you!");
    //Save the edited url into the database
  } else {
    urlDatabase[id].longURL = longURL;
    res.redirect("/urls");
  }
});


//Post the newly added long and short urls to the database
app.post("/urls", (req, res) => {
  //Check if user is logged in
  if (!req.cookies["user_id"]) {
    res.send("You must be logged in to create a tiny URL!");
  } else {
    //Create short url
    const shortURL = generateRandomString(6);
    let longURL = req.body.longURL;

    //If the user didn't add http:// or https://, add http
    const httpRegex = /^http:\/\//;
    const httpsRegex = /^https:\/\//;

    if (!httpRegex.test(longURL) && !httpsRegex.test(longURL)) {
      longURL = "http://" + longURL;
    }

    //Save short and long url mapping along with the userID
    urlDatabase[shortURL] = { longURL: longURL };
    urlDatabase[shortURL].userID = req.cookies["user_id"];

    //Redirect to the new URL's page
    res.redirect(`/urls/${shortURL}`);
  }
});


//Handle user registration data
app.post("/register", (req, res) => {
  const email = req.body.email.trim();
  const password = req.body.password.trim();
  const hashedPassword = bcrypt.hashSync(password, 10);
  const checkUser = getUserByEmail(users, email);

  //Validate email and password
  if (!email || !password) {
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
      id: id, email: email, password: hashedPassword
    };

    res.redirect("/urls");
  }
});


//Handle user log in input
app.post("/login", (req, res) => {
  const email = req.body.email.trim();
  const password = req.body.password.trim();
  const checkUser = getUserByEmail(users, email);

  if (checkUser.email === email && bcrypt.compareSync(password, checkUser.password)) {
    res.cookie("user_id", checkUser.id);
    res.redirect("/urls");
  } else {
    res.status(403).send("Invalid login");
  }
});


//Clear cookie when user logs out
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");

  res.redirect("/login");
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});