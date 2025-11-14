const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req,res) => {
    // Extract username & password from request body
    const { username, password } = req.body;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({message: "Username & Password is required"});
    }

    // Check if the user already exists
    const userExists = users.find(user => user.username === username);
    if (userExists) {
        return res.status(404).json({message: "User already esists. Try another username"});
    }

    // Register new user
    users.push({ username, password });

    res.status(200).json({ message: "User regsitered successfully." });
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    try {
        const response = await new Promise((resolve) => resolve({ data: books }));
        return res.status(200).json(response.data);
    } catch (err) {
        return res.status(404).json({ message: "No Books in the Library" });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;

  try {
    const response = await new Promise((resolve, reject) => {
      if (books[isbn]) {
        resolve({ data: books[isbn] });
      } else {
        reject(new Error("Book not found"));
      }
    });

    return res.status(200).json(response.data);
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
});
  
// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
  const author = req.params.author.toLowerCase().trim();

  try {
    const response = await new Promise((resolve, reject) => {
      let booksByAuthor = [];

      for (let key in books) {
        if (books[key].author.toLowerCase().trim() === author) {
          booksByAuthor.push(books[key]);
        }
      }

      if (booksByAuthor.length > 0) {
        resolve({ data: booksByAuthor });
      } else {
        reject(new Error("No books found for the specified author"));
      }
    });

    return res.status(200).json(response.data);
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
});
// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
    const title = req.params.title.toLowerCase().trim();
  
    try {
      const response = await new Promise((resolve, reject) => {
        let booksByTitle = [];
  
        for (let key in books) {
          if (books[key].title.toLowerCase().trim() === title) {
            booksByTitle.push(books[key]);
          }
        }
  
        if (booksByTitle.length > 0) {
          resolve({ data: booksByTitle });
        } else {
          reject(new Error("No books found with the specified title"));
        }
      });
  
      return res.status(200).json(response.data);
    } catch (err) {
      return res.status(404).json({ message: err.message });
    }
  });
  
//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    // Extract isbn from the request parameters
    const isbn = req.params.isbn;
    if (isbn) {
        return res.status(200).json(books[isbn].reviews);
    }
});

module.exports.general = public_users;
