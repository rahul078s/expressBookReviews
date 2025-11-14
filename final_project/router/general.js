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
public_users.get('/author/:author',function (req, res) {
    // Extract author from req
    const author = req.params.author;
    let booksByAuthor = [];
    for (let key in books) {
        if (books[key].author.toLowerCase().trim() === author.toLowerCase().trim()) {
            booksByAuthor.push(books[key]);
        }
        // If no book found
        if (booksByAuthor.length === 0) {
            return res.status(404).json({message: "No books with the specified author"});
        }
        // Return all books found
        return res.status(200).json(booksByAuthor);
    }
}); 

// Get all books based on title
public_users.get('/title/:title', (req, res) => {
    const title = req.params.title;     // Extract the title from URL
    const booksByTitle = [];            // Array to store matches
  
    // Loop through all books in the database
    for (let key in books) {
      if (books[key].title.toLowerCase().trim() === title.toLowerCase().trim()) {
        booksByTitle.push(books[key]);
      }
    }
  
    // If no books found, send 404
    if (booksByTitle.length === 0) {
      return res.status(404).json({ message: "No books found with that title" });
    }
  
    // Send all matched books
    return res.status(200).json(booksByTitle);
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
