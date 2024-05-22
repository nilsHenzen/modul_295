const http = require('http');
const bl = require('bl');

const url = process.argv[2];

http.get(url, (response) => {
    response.pipe(bl((err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        const content = data.toString();
        console.log(content.length);
        console.log(content);
    }));
});
