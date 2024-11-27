const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// Register a new user
public_users.post('/register', (req, res) => {
    const { username, password } = req.body; // Extract username and password from request body

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" }); // Validation check
    }

    // Check if username already exists
    const userExists = users.some(user => user.username === username);

    if (userExists) {
        return res.status(409).json({ message: "Username already exists" }); // Conflict error
    }

    // Add the new user
    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully" }); // Success response
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    // Use JSON.stringify for formatting
    return res.status(200).send(JSON.stringify(books, null, 4)); // Pretty print with 4 spaces
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn; // Retrieve the ISBN from the request parameters
    const book = books[isbn]; // Lookup the book by ISBN in the `books` object
    if (book) {
        return res.status(200).json(book); // Return the book details as JSON
    } else {
        return res.status(404).json({ message: "Book not found" }); // Return error if ISBN not found
    }
});

public_users.get('/isbns', function (req, res) {
    const isbns = Object.keys(books); // Get all the ISBNs from the `books` object
    return res.status(200).json({ isbns });
});
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author; // Extract author from request parameters
    const booksByAuthor = Object.values(books).filter(book => book.author === author); // Find books by author

    if (booksByAuthor.length > 0) {
        return res.status(200).json(booksByAuthor); // Return the books by the author
    } else {
        return res.status(404).json({ message: "No books found for the given author" }); // If no books found
    }
});

// Get book details based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title; // Extract title from request parameters
    const booksByTitle = Object.values(books).filter(book => book.title === title); // Find books by title

    if (booksByTitle.length > 0) {
        return res.status(200).json(booksByTitle); // Return the books by the title
    } else {
        return res.status(404).json({ message: "No books found with the given title" }); // If no books found
    }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn; // Extract ISBN from request parameters
    const book = books[isbn]; // Lookup the book by ISBN
    if (book && book.reviews) {
        return res.status(200).json(book.reviews); // Return the book reviews
    } else {
        return res.status(404).json({ message: "Reviews not found for the given ISBN" }); // If no reviews found
    }
});

module.exports.general = public_users;
