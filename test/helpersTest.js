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




const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;

chai.use(chaiHttp);

describe("Login and Access Control Test", () => {
  it('should return 403 status code for unauthorized access to "http://localhost:8080/urls/b2xVn2"', () => {
    const agent = chai.request.agent("http://localhost:8080");

    // Step 1: Login with valid credentials
    return agent
      .post("/login")
      .send({ email: "user2@example.com", password: "dishwasher-funk" })
      .then((loginRes) => {
        // Step 2: Make a GET request to a protected resource
        return agent.get("/urls/b2xVn2").then((accessRes) => {
          // Step 3: Expect the status code to be 403
          expect(accessRes).to.have.status(403);
        });
      });
  });
});

describe('Accessing Home Page without Login', () => {
  it('should redirect to login page if user is not logged in', () => {
    return chai.request('http://localhost:8080')
      .get('/')
      .then((res) => {
        //Can't check status code 302 because chai will check the code after the redirect to the login (then status is 200)
        expect(res.redirects[0]).to.equal('http://localhost:8080/login'); // Expecting redirection to login page
      });
  });
});

describe('Accessing New URL Page without Login', () => {
  it('should redirect to login page if user is not logged in', () => {
    return chai.request('http://localhost:8080')
      .get('/urls/new')
      .then((res) => {
        //Can't check status code 302 because chai will check the code after the redirect to the login (then status is 200)
        expect(res.redirects[0]).to.equal('http://localhost:8080/login'); // Expecting redirection to login page
      });
  });
});

describe('Accessing URL without Login', () => {
  it('should return 403 status code if user is not logged in', () => {
    return chai.request('http://localhost:8080')
      .get('/urls/b2xVn2')
      .then((res) => {
        expect(res).to.have.status(403); // Expecting status code 403 (Forbidden)
      });
  });
});

describe('Accessing Non-existent URL', () => {
  it('should return 404 status code for non-existent URL', () => {
    return chai.request('http://localhost:8080')
      .get('/urls/NOTEXISTS')
      .then((res) => {
        expect(res).to.have.status(404); // Expecting status code 404 (Not Found)
      });
  });
});