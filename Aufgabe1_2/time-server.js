const net = require('net');

function zeroFill(number) {
    return (number < 10 ? '0' : '') + number;
}

function getCurrentDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = zeroFill(now.getMonth() + 1);
    const day = zeroFill(now.getDate());
    const hours = zeroFill(now.getHours());
    const minutes = zeroFill(now.getMinutes());
    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

const server = net.createServer((socket) => {
    const currentTime = getCurrentDateTime() + '\n';
    socket.write(currentTime);
    socket.end();
});

const port = process.argv[2];
server.listen(port);
