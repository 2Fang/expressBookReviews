const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  if (users.some(user => user.username === username)) {
    return res.status(400).json({ message: "Username already exists" });
  }
  users.push({ username, password });
  return res.status(200).json({ message: "User registered successfully" });
});

// Task 1: Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).json(books);
});

// Task 2: Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const { isbn } = req.params;
  const book = books[isbn];
  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Task 3: Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const { author } = req.params;
  const filteredBooks = Object.values(books).filter(book => book.author === author);
  if (filteredBooks.length > 0) {
    return res.status(200).json(filteredBooks);
  } else {
    return res.status(404).json({ message: "No books found by this author" });
  }
});

// Task 4: Get book details based on title
public_users.get('/title/:title', function (req, res) {
  const { title } = req.params;
  const filteredBooks = Object.values(books).filter(book => book.title === title);
  if (filteredBooks.length > 0) {
    return res.status(200).json(filteredBooks);
  } else {
    return res.status(404).json({ message: "No books found with this title" });
  }
});

// Task 5: Get book review
public_users.get('/review/:isbn', function (req, res) {
  const { isbn } = req.params;
  const book = books[isbn];
  if (book) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Task 10: Get the book list available in the shop using async/await with Axios
public_users.get('/', async (req, res) => {
    try {
      const response = await axios.get('http://localhost:5000/books'); // Assuming a books endpoint exists
      return res.status(200).json(response.data);
    } catch (error) {
      return res.status(500).json({ message: "Error fetching books" });
    }
  });
  
  // Task 11: Get book details based on ISBN using async/await with Axios
  public_users.get('/isbn/:isbn', async (req, res) => {
    const { isbn } = req.params;
    try {
      const response = await axios.get(`http://localhost:5000/books/${isbn}`);
      return res.status(200).json(response.data);
    } catch (error) {
      return res.status(500).json({ message: "Error fetching book details" });
    }
  });
  
  // Task 12: Get book details based on author using async/await with Axios
  public_users.get('/author/:author', async (req, res) => {
    const { author } = req.params;
    try {
      const response = await axios.get(`http://localhost:5000/books/author/${author}`);
      return res.status(200).json(response.data);
    } catch (error) {
      return res.status(500).json({ message: "Error fetching books by author" });
    }
  });
  
  // Task 13: Get book details based on title using async/await with Axios
  public_users.get('/title/:title', async (req, res) => {
    const { title } = req.params;
    try {
      const response = await axios.get(`http://localhost:5000/books/title/${title}`);
      return res.status(200).json(response.data);
    } catch (error) {
      return res.status(500).json({ message: "Error fetching books by title" });
    }
  });

module.exports.general = public_users;
