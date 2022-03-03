const http = require('http')
const { get_handler } = require('./m0701')

http.createServer((req, res) =>
{
    get_handler('static', res, req)
}).listen(3000)