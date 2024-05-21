const express = require('express');
const router = express.Router();

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

const isAuthenticated = (req, res, next) => {
    if (req.session.authenticated) {
      next();
    } else {
      res.status(401).send('Unauthorized');
    }
};

router.get('/lends', isAuthenticated, (request, response) => {
    response.send(lends);
});

router.get('/lends/:id', isAuthenticated, (request, response) => {
    const id = request.params.id;

    const lend = lends.find(lend => lend.id == id);
    response.send(lend);
});

router.post('/lends', isAuthenticated, (request, response) => {
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

router.delete('/lends/:id', isAuthenticated, (request, response) => {
    const id = request.params.id;

    lends = lends.filter(lend => lend.id != id);    
    response.sendStatus(204);
});

module.exports = router;