const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
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

app.use(express.json());

app.get('/books', (request, response) => {
    response.send(books);
});

app.get('/books/:isbn', (request, response) => {
    const isbn = request.params.isbn;

    const book = books.find(book => book.isbn === isbn);
    response.send(book);
});

app.post('/books', (request, response) => {
    const newbook = request.body;

    books.push(newbook);

    response.send(books);
});

app.put('/books/:isbn', (request, response) => {
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

app.delete('/books/:isbn', (request, response) => {
    const isbn = request.params.isbn;
    books = books.filter(book => book.isbn !== isbn);    
    response.send(books);
});

app.patch('/books/:isbn', (request, response) => {
    const updatedBook = request.body;
    const isbn = request.params.isbn;
    const bookIndex = books.findIndex((book) => book.isbn === isbn);

    books[bookIndex] = { ...books[bookIndex], ...updatedBook };

    response.send(books);

});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});