// Imports
//External
const express = require("express");
const cookieSession = require('cookie-session');
const bcrypt = require("bcryptjs");
const methodOverride = require('method-override')
const app = express();

//Internal
const {
  generateRandomString,
  getUserByEmail,
  urlsForUserID,
  checkURL
} = require("./helpers");
const { PORT, urlDatabase, users } = require("./data")


// View engine
app.set("view engine", "ejs");


// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride('_method'))
app.use(cookieSession({
  name: 'session',
  keys: ['thisisareallylongkeyyy12345', 'thisianotherreallylongkey098765'],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));


// Routes
// GET

app.get("/", (req, res) => {
  const userID = req.session.user_id;
  if (userID) {
    res.send("Hello!");
  } else {
    res.status(302).redirect("/login");
  }
});


app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});


//Render the new user registration page
app.get("/register", (req, res) => {
  const userID = req.session.user_id;
  const templateVars = {
    urls: urlDatabase,
    users: users,
    id: userID
  };
  res.render("register", templateVars);
});


//Render the login page
app.get("/login", (req, res) => {
  const userID = req.session.user_id;
  const templateVars = {
    urls: urlDatabase,
    users: users,
    id: userID
  };
  res.render("login", templateVars);
});


//Render submit new url page
app.get("/urls/new", (req, res) => {
  const userID = req.session.user_id;
  const templateVars = {
    urls: urlDatabase,
    users: users,
    id: userID
  };

  if (userID) {
    res.render("urls_new", templateVars);
  } else {
    res.status(302).redirect("/login");
  }
});


//Render list of short and long urls for the user logged in
app.get("/urls", (req, res) => {
  const userID = req.session.user_id;
  const templateVars = {
    urls: urlDatabase,
    users: users,
    id: userID,
    userURLs: urlsForUserID(urlDatabase, userID)
  };

  if (userID) {
    res.render("urls_index", templateVars);
  } else {
    res.status(403).send("You must be logged in to view URLs");
  }
});


//Render the page showing long url and its short url
app.get("/urls/:id", (req, res) => {
  //id is the shortURL
  const userID = req.session.user_id;
  const id = req.params.id;

  if (!urlDatabase[id]) {
    res.status(404).send("URL does not exist in the database");
  } else {
    const templateVars = {
      shortURL: id,
      longURL: urlDatabase[id].longURL,
      users: users,
      id: userID
    };

    const userURLs = urlsForUserID(urlDatabase, templateVars.id);
    //Make sure shortURL belongs to the logged in user
    if (checkURL(userURLs, urlDatabase, id, userID)) {
      res.render("urls_show", templateVars);
    } else {
      res.status(403).send("Cannot view a URL that does not belong to you!");
    }
  }
});


//Redirect to the long url (id is the short url)
app.get("/u/:id", (req, res) => {
  //id is the shortURL
  const id = req.params.id;
  const longURL = urlDatabase[id].longURL;
  const userID = req.session.user_id;
  const userURLs = urlsForUserID(urlDatabase, userID);

  //Check if user is logged in
  if (!userID) {
    res.status(403).send("You must be logged in to view the URLS");
    //Make sure shortURL belongs to the logged in user
  } else if (!checkURL(userURLs, urlDatabase, id, userID)) {
    res.status(403).send("Cannot view a URL that does not belong to you!");
    //Check if shortURL is in the database
  } else if (!urlDatabase[id]) {
    res.status(404).send(`<html><body>ERROR! Short URL ${id} doesn't exist</b></body></html>\n`);
  } else
    res.redirect(longURL);
});

// Routes
// POST

//Remove a url from the database
app.delete("/urls/:id/delete", (req, res) => {
  //id is the shortURL
  const id = req.params.id;
  const userID = req.session.user_id;
  const userURLs = urlsForUserID(urlDatabase, userID);

  if (!userID) {
    res.send("You must be logged in to delete a URL!");
  } else if (!checkURL(userURLs, urlDatabase, id, userID)) {
    res.status(403).send("Cannot delete a URL that does not belong to you!");
    //Delete the database entry
  } else {
    delete urlDatabase[id];
    res.redirect("/urls");
  }
});


//Edit a long url in the database
app.put("/urls/:id", (req, res) => {
  //id is the shortURL
  const id = req.params.id;
  const longURL = req.body.longURL;
  const userID = req.session.user_id;
  const userURLs = urlsForUserID(urlDatabase, userID);

  if (!userID) {
    res.send("You must be logged in!");
  } else if (!checkURL(userURLs, urlDatabase, id, userID)) {
    res.status(403).send("Cannot edit a URL that does not belong to you!");
    //Save the edited url into the database
  } else {
    urlDatabase[id].longURL = longURL;
    res.redirect("/urls");
  }
});


//Post the newly added long and short urls to the database
app.post("/urls", (req, res) => {
  const userID = req.session.user_id;

  //Check if user is logged in
  if (!userID) {
    res.status(403).send("You must be logged in to create a tiny URL!");
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
    urlDatabase[shortURL].userID = userID;

    //Redirect to the new URL's page
    res.redirect(`/urls/${shortURL}`);
  }
});


//Handle user registration data
app.post("/register", (req, res) => {
  const email = req.body.email.trim();
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const checkUser = getUserByEmail(users, email);

  //Validate email and password
  if (!email || !password) {
    res.status(400).send("Cannot leave email or password blank!");
    //Check if email exists in the users database
  } else if (checkUser.email === email) {
    res.status(400).send("Email already exists! Cannot use duplicate email.");
  } else {
    //Generate user ID, encrypt, and set in cookie
    const id = generateRandomString(12);
    req.session.user_id = id;
    res.cookie("user_id", req.session.user_id);
    //Save new user to the database
    users[req.session.user_id] = {
      id: req.session.user_id, email: email, password: hashedPassword
    };

    res.redirect("/urls");
  }
});


//Handle user log in input
app.post("/login", (req, res) => {
  const email = req.body.email.trim();
  const password = req.body.password;
  const checkUser = getUserByEmail(users, email);

  //Validate user email and password
  if (checkUser.email === email && bcrypt.compareSync(password, checkUser.password)) {
    req.session.user_id = checkUser.id;
    res.cookie("user_id", checkUser.id);
    res.redirect("/urls");
  } else {
    res.status(403).send("Invalid login");
  }
});


//Clear cookie when user logs out
app.post("/logout", (req, res) => {
  req.session = null;
  res.clearCookie("user_id");

  res.redirect("/login");
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});