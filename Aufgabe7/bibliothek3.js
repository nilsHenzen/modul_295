const express = require('express');
const app = express();
const session = require('express-session');
const port = 3000;
const mail = "zli";
const password = "m295";

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

app.use(session({
    secret: 'abc123',
    resave: false,
    saveUninitialized: false,
    cookie: {}
}));

const isAuthenticated = (req, res, next) => {
    if (req.session.authenticated) {
      next();
    } else {
      res.status(401).send('Unauthorized');
    }
};

app.post('/login', (req, res) => {
        const credentials = atob(req.headers.authorization.replace("Basic ", "")).split(":");
        if (credentials[0] === mail && credentials[1] === password) {
            req.session.mail = credentials[0];
            req.session.authenticated = true;
            res.sendStatus(201);
        } else {
            res.send(401);
        }
});
  
app.get('/verify', (req, res) => {
    if (req.session.authenticated) {
        res.status(200).json({ email: req.session.mail, statusCode: 200 });
    } else {
        res.status(401).send('Unauthorized');
    }
});
  
app.delete('/logout', (req, res) => {
    req.session.authenticated = false;
    req.session.mail = "";
    res.status(204).send();
});

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

    if(newbook.id && newbook.customer_id && newbook.isbn && newbook.borrowed_at) {
        books.push(newbook);

        response.send(books);
    } else {
        response.sendStatus(409);
    }


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
    response.sendStatus(204);
});

app.patch('/books/:isbn', (request, response) => {
    const updatedBook = request.body;
    const isbn = request.params.isbn;
    const bookIndex = books.findIndex((book) => book.isbn === isbn);

    books[bookIndex] = { ...books[bookIndex], ...updatedBook };

    response.send(books);

});

app.get('/lends', isAuthenticated, (request, response) => {
    response.send(lends);
});

app.get('/lends/:id', isAuthenticated, (request, response) => {
    const id = request.params.id;

    const lend = lends.find(lend => lend.id == id);
    response.send(lend);
});

app.post('/lends', isAuthenticated, (request, response) => {
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
            response.send(lends);
        } else {
            response.sendStatus(400);
        }
    } else {
        response.sendStatus(422);
    }
});

app.delete('/lends/:id', isAuthenticated, (request, response) => {
    const id = request.params.id;

    lends = lends.filter(lend => lend.id != id);    
    response.sendStatus(204);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});