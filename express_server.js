const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

function generateRandomString() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const charLength = chars.length;
  const length = 6;
  let result = '';

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * charLength));
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

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

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
  const longURL = urlDatabase[req.params.id];

//Check if id exists in the database. Display error if doesn't. Redirect if does
  if (!urlDatabase[req.params.id]) {
    res.send(`<html><body>ERROR! Shor URL ${req.params.id} doesn't exist</b></body></html>\n`);
  } else
    res.redirect(longURL);
});

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

  //Save short and long url mapping to the database
  urlDatabase[shortURL] = longURL;

  console.log(req.body); // Log the POST request body to the console

  // Redirect to the new URL's page
  res.redirect(`/urls/${shortURL}`);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});