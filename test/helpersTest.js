const { assert } = require('chai');

const { getUserByEmail } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail(testUsers, "user@example.com");
    const expectedUserEmail = "user@example.com";
    
    assert.equal(user.email, expectedUserEmail);
  });

  it('should return undefined with an invalid email', function() {
    const user = getUserByEmail(testUsers, "nouser@example.com");
    const expectedUserEmail = undefined;
    
    assert.equal(user.email, expectedUserEmail);
  });
});