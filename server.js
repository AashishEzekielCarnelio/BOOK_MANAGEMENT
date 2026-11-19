
const express = require("express");
const path = require("path");
const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname,"frontend")));

// Store book details
let books = [
    { id: 1, title: "Java", author: "James", price: 500 },
    { id: 2, title: "Python", author: "Guido", price: 600 }
];

// Home page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

// GET - Retrieve all books
app.get("/books", (req, res) => {
    res.json(books);
});

// GET - Retrieve book by ID
app.get("/books/:id", (req, res) => {
    const id = Number(req.params.id);
    const book = books.find(b => b.id === id);

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    res.json(book);
});

// POST - Add new book
app.post("/books", (req, res) => {
    const { id, title, author, price } = req.body;

    if (!Number.isInteger(id) || id <= 0 ||
        typeof title !== "string" || !title.trim() ||
        typeof author !== "string" || !author.trim() ||
        typeof price !== "number" ||
        !Number.isFinite(price) || price < 0) {
        return res.status(400).json({
            message: "Invalid book details"
        });
    }

    const existingBook = books.find(b => b.id === id);

    if (existingBook) {
        return res.status(409).json({
            message: "Book ID already exists"
        });
    }

    const newBook = { id, title, author, price };
    books.push(newBook);

    res.status(201).json({
        message: "Book added successfully"
    });
});

// PUT - Update book
app.put("/books/:id", (req, res) => {
    const id = Number(req.params.id);
    const book = books.find(b => b.id === id);

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    const { title, author, price } = req.body;

    if (typeof title !== "string" || !title.trim() ||
        typeof author !== "string" || !author.trim() ||
        typeof price !== "number" ||
        !Number.isFinite(price) || price < 0) {
        return res.status(400).json({
            message: "Invalid book details"
        });
    }

    book.title = title;
    book.author = author;
    book.price = price;

    res.json({
        message: "Book updated successfully"
    });
});

// DELETE - Delete book
app.delete("/books/:id", (req, res) => {
    const id = Number(req.params.id);
    const index = books.findIndex(b => b.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    books.splice(index, 1);

    res.json({
        message: "Book deleted successfully"
    });
});


 // EDIT - Edit book details by ID

app.patch("/books/:id", (req, res) => {
    const id = Number(req.params.id);
    const book = books.find(b => b.id === id);

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    const { title, author, price } = req.body;

    if (title !== undefined &&
        (typeof title !== "string" || !title.trim())) {
        return res.status(400).json({
            message: "Invalid title"
        });
    }

    if (author !== undefined &&
        (typeof author !== "string" || !author.trim())) {
        return res.status(400).json({
            message: "Invalid author"
        });
    }

    if (price !== undefined &&
        (typeof price !== "number" ||
         !Number.isFinite(price) || price < 0)) {
        return res.status(400).json({
            message: "Invalid price"
        });
    }

    if (title !== undefined) book.title = title.trim();
    if (author !== undefined) book.author = author.trim();
    if (price !== undefined) book.price = price;

    res.json({
        message: "Book edited successfully",
        book: book
    });
});


// Error handling
app.use((err, req, res, next) => {
    console.error("Actual error:", err.message);

    res.status(err.status || 500).json({
        message: err.message
    });
});

// Start server
app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
