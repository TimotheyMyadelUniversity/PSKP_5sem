
const http = require('http')
const fs = require('fs')
const FormData = require("form-data");

http.createServer((req, res) =>
{
    const readStream = fs.createReadStream('./pic.png');

    const form = new FormData();
    form.append('file', readStream);

    res.writeHead(200, 'Normal', form.getHeaders())
    res.end(fs.readFileSync('pic.png'));

}).listen(3000)