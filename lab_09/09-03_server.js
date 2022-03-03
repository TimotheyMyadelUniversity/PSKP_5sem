const http = require('http')
const url = require('url')
const querystring = require('querystring')

http.createServer((req, res) =>
{
    let urlObject = url.parse(req.url)
    let data = ''
    req.on('data', chunk =>
    {
        data += chunk
    })
    req.on('end', () =>
    {
        let queryObject = querystring.parse(data)
        let x = Number(queryObject.x)
        let y = Number(queryObject.y)
        let s = Number(queryObject.s)
        res.writeHead(200, 'Normalno')
        res.end(`${x} + ${y} + ${s} = ${x + y + s}`)
    })
}).listen(3000)