const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");

const getAllBooks = () => {
    return books;
};

public_users.post("/register", (req,res) => {
  //Write your code here
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    try {
        const allBooks = await getAllBooks();
        return res.status(200).json(allBooks);
    } catch (e) {
        res.status(500).send(e);
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
    try {
        const isbn = req.params.isbn;
        const allBooks = await getAllBooks();
        const foundBook = allBooks[isbn];
        if (!foundBook) {
            return res.status(404).json({ message: "ISBN not found." });
        } else {
            return res.status(200).json(foundBook);
        }
    } catch (e) {
        res.status(500).send(e);
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
    try {
        const author = req.params.author;
        const allBooks = await getAllBooks();
        const foundBooks = Object.values(allBooks).filter(
            book => book.author.toLowerCase() === author.toLowerCase()
        );
        if (foundBooks.length) {
            return res.status(200).json(foundBooks)
        } else {
            return res.status(404).json({ message: "No books by that author." });
        }
    } catch (e) {
        res.status(500).send(e);
    }
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
    try {
        const title = req.params.title;
        const allBooks = await getAllBooks();
        const foundBooks = Object.values(allBooks).filter(
            book => book.title.toLowerCase() === title.toLowerCase()
        );
        if (foundBooks.length) {
            return res.status(200).json(foundBooks)
        } else {
            return res.status(404).json({ message: "No books by that title." });
        }
    } catch (e) {
        res.status(500).send(e);
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews)
});

module.exports.general = public_users;
