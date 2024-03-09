// Helper functions for express_server.js

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


module.exports = {
  generateRandomString,
  getUserByEmail,
  urlsForUserID,
  checkURL
};