const http = require('http');

const urls = process.argv.slice(2);

let count = 0;

const responses = [];

function fetchData(url, index) {
    http.get(url, (response) => {
        let data = '';
        response.setEncoding('utf8');
        
        response.on('data', (chunk) => {
            data += chunk;
        });
        
        response.on('end', () => {
            responses[index] = data;
            count++;

            if (count === urls.length) {
                responses.forEach((responseData) => {
                    console.log(responseData);
                });
            }
        });
        
        response.on('error', (err) => {
            console.error(err);
        });
    });
}

urls.forEach((url, index) => {
    fetchData(url, index);
});
