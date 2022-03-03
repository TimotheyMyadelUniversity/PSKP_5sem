const http = require('http')
const url = require('url')
const querystring = require('querystring')

http.createServer((req, res) =>
{
    let urlObject = url.parse(req.url)
    let queryObject = querystring.parse(urlObject.query)
    console.log(queryObject)

    let x = Number(queryObject.x)
    let y = Number(queryObject.y)

    res.writeHead(200, 'Normalno')
    res.end(`${x} + ${y} = ${x + y}`)
}).listen(3000)