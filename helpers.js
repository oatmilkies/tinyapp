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

module.exports = {
  getUserByEmail
}