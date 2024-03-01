const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");

//Initial url database
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//Generate a random character string 6 charcters long
function generateRandomString() {
  const possibleChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const charLength = possibleChars.length;
  const length = 6;
  let result = '';

  for (let i = 0; i < length; i++) {
    result += possibleChars.charAt(Math.floor(Math.random() * charLength));
  }
  return result;
}

app.use(express.urlencoded({ extended: true }));

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
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

//Render submit new url page
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

//Render the page showing long url and its short url
app.get("/urls/:id", (req, res) => {
  //req.params.id is the short url
  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id]
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

//Post the newly added long and short urls to the database
app.post("/urls", (req, res) => {
  //Create short url
  const shortURL = generateRandomString();
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
  res.redirect("/urls")
});

//Edit a long url in the database
app.post("/urls/:id", (req, res) => {
  const id = req.params.id;
  const longURL = req.body.longURL;

  //Save the edited url into the database
  urlDatabase[id] = longURL;

  //Redirect back to the index page
  res.redirect("/urls")
});

app.post("/login", (req, res) => {
  //Get the username from the request body
  const username = req.body.username;
  res.cookie('username', username)

  //Redirect back to the index page
  res.redirect("/urls")
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});