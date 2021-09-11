const { assert } = require('chai');

const { getUserWithEmail } = require('../helpers.js');

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

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "userRandomID" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "userRandomID" }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserWithEmail("user@example.com", testUsers);
    const expectedOutput = "userRandomID";
    assert.equal(user.id, expectedOutput);
  });

  it('should return a undefined with invalid email', function() {
    const user = getUserWithEmail("user3@example.com", testUsers);
    const expectedOutput = undefined;
    assert.equal(user, expectedOutput);
  });
});

