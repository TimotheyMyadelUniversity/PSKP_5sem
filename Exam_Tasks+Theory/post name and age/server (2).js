var http = require('http')
var url = require('url')
var query = require('querystring')
var fs = require('fs')

let collectData = (req, clbck) => 
{
    let data = ''
    req.on('data', chunk => data += chunk)
    req.on('end', () => clbck(data))
}

http.createServer((req, res) => {
    parsed_url = url.parse(req.url, true)
    pathname = parsed_url.pathname

    if (req.method == 'POST' & pathname == '/') {
        collectData(req, data => {
            let writeStream = fs.createWriteStream('./response.txt')
            writeStream.write(data)

            console.log(data);

            res.writeHead(200, { 'Content-Type':'text/plain; charset=utf-8' })
            res.end('done')
        })
    }
    else {
        res.writeHead(200, { 'Content-Type':'text/plain; charset=utf-8' })
        res.end('incorect request')
    }
}).listen(3000, () => { console.log('server start'); })