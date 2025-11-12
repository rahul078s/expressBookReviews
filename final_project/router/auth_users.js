const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");

const regd_users = express.Router();

// In-memory user store
let users = [];

// Function to check if username already exists
const isValid = (username) => {
  // Returns true if user exists, false otherwise
  return users.some((user) => user.username === username);
};

// Function to check if username & password are correct
const authenticatedUser = (username, password) => {
  return users.some((user) => user.username === username && user.password === password);
};

// LOGIN ROUTE — Only registered users can log in
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Check if both fields are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  // Check if user exists and credentials are valid
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password." });
  }

  // Generate JWT token
  const accessToken = jwt.sign({ username }, "access", { expiresIn: "1h" });

  // Store token in session
  req.session.authorization = { accessToken, username };

  // Send success response
  return res.status(200).json({
    message: "User successfully logged in.",
    token: accessToken
  });
});

// ADD A BOOK REVIEW — Only logged-in users can do this
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;

  // Check if the user is logged in (token stored in session)
  if (!req.session.authorization || !req.session.authorization.username) {
    return res.status(403).json({ message: "User not logged in." });
  }

  const username = req.session.authorization.username;

  // Check if the book exists
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found." });
  }

  // If review provided, add/update it
  if (review) {
    books[isbn].reviews[username] = review;
    return res.status(200).json({ message: "Review added/updated successfully.", reviews: books[isbn].reviews });
  } else {
    return res.status(400).json({ message: "Please provide a review." });
  }
});

// DELETE REVIEW — optional (you can add this later)
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;

  if (!req.session.authorization || !req.session.authorization.username) {
    return res.status(403).json({ message: "User not logged in." });
  }

  const username = req.session.authorization.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found." });
  }

  if (books[isbn].reviews[username]) {
    delete books[isbn].reviews[username];
    return res.status(200).json({ message: "Review deleted successfully." });
  } else {
    return res.status(404).json({ message: "You have not reviewed this book yet." });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
