const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    return res.status(200).json({
        message: "List of all available books",
        books: books
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    // Extract isbn from req
    const isbn = req.params.isbn;
    // Check if isbn provided
    if (books[isbn]) {
        return res.status(200).json(books[isbn]);
    } else {
        return res.status(404).json({message: "Book not found"});
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
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
