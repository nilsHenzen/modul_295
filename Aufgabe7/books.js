const express = require('express');
const router = express.Router();

let books = [
    {
        "isbn": "1",
        "title": "To Kill a Mockingbird",
        "year": 1960,
        "author": "Harper Lee"
    },
    {
        "isbn": "2",
        "title": "1984",
        "year": 1949,
        "author": "George Orwell"
    },
    {
        "isbn": "3",
        "title": "The Great Gatsby",
        "year": 1925,
        "author": "F. Scott Fitzgerald"
    },
    {
        "isbn": "4",
        "title": "The Catcher in the Rye",
        "year": 1951,
        "author": "J.D. Salinger"
    },
    {
        "isbn": "5",
        "title": "The Hobbit",
        "year": 1937,
        "author": "J.R.R. Tolkien"
    }
]

router.get('/books', (request, response) => {
    response.send(books);
});

router.get('/books/:isbn', (request, response) => {
    const isbn = request.params.isbn;

    const book = books.find(book => book.isbn === isbn);
    response.send(book);
});

router.post('/books', (request, response) => {
    const newbook = request.body;

    if (newbook.id && newbook.customer_id && newbook.isbn && newbook.borrowed_at) {
        books.push(newbook);

        response.send(books);
    } else {
        response.sendStatus(409);
    }


});

router.put('/books/:isbn', (request, response) => {
    const updatedBook = request.body;
    const isbn = request.params.isbn;

    books = books.map(book => {
        if (book.isbn === isbn) {
            return { ...book, ...updatedBook };
        }
        return book;
    });
    response.send(books);
});

router.delete('/books/:isbn', (request, response) => {
    const isbn = request.params.isbn;
    books = books.filter(book => book.isbn !== isbn);
    response.sendStatus(204);
});

router.patch('/books/:isbn', (request, response) => {
    const updatedBook = request.body;
    const isbn = request.params.isbn;
    const bookIndex = books.findIndex((book) => book.isbn === isbn);

    books[bookIndex] = { ...books[bookIndex], ...updatedBook };

    response.send(books);

});

module.exports = router;