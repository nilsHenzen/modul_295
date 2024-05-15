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

let lends = [{
    "id": 1,
    "customer_id": 1,
    "isbn": 1,
    "borrowed_at": "01.01.2024",
    "returned_at": "02.02.2024"
},
{
    "id": 2,
    "customer_id": 2,
    "isbn": 2,
    "borrowed_at": "01.01.2024",
    "returned_at": "02.02.2024"
}]

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

app.get('/lends', (request, response) => {
    response.send(lends);
});

app.get('/lends/:id', (request, response) => {
    const id = request.params.id;

    const lend = lends.find(lend => lend.id == id);
    response.send(lend);
});

app.post('/lends', (request, response) => {
    const newlend = request.body;
    const existIdArray = lends.map(lend => lend.id === newlend.id);
    const existId = existIdArray.includes(true);
    const booklendArray = lends.map(lend => lend.isbn === newlend.isbn);
    const booklend = booklendArray.includes(true);
    const userlends = lends.filter(lend => lend.customer_id === newlend.customer_id && !lend.returned_at);

    if (booklend) {
        return response.status(409).send({ message: 'This book is already lent out.' });
    }

    if (userlends.length >= 3) {
        return response.status(409).send({ message: 'Customer already has 3 open lends.' });
    }

    if (newlend.id && newlend.customer_id && newlend.isbn && newlend.borrowed_at) {

        if(!existId) {
            lends.push(newlend);
            response.send(newlend);
        } else {
            response.sendStatus(400);
        }
    } else {
        response.sendStatus(422);
    }
});

app.delete('/lends/:id', (request, response) => {
    const id = request.params.id;

    lends = lends.filter(lend => lend.id != id);    
    response.send(lends);
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});