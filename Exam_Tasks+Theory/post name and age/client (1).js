var http = require('http')
var query = require('querystring')
var fs = require('fs')

let options_post = {
    host: 'localhost',
    path: '/',
    port: 3000,
    method: 'POST'
}

let send_request = (options, resHandler, data = {}) =>
{
    const req = http.request(options, res => resHandler(res))

    req.on('error', error => console.log(error))

    req.write(JSON.stringify(data))

    req.end()
}

// let body = fs.readFileSync('./params.txt')
send_request(options_post, res => {
    let writeStream = fs.createWriteStream('./answer.txt')
    res.pipe(writeStream)
}, { name:"timothey", age: 20 })