const WebSocket = require('ws');
const http = require('http')
const url = require('url')
const fs = require('fs')

const wsServer = new WebSocket.Server({port: 4000});

wsServer.on('connection', (wsClient) =>
{

    console.log(wsClient._socket?.remoteAddress)

    let num = 0
    let i = 0

    let reg = new RegExp(/^10-\d{2}-client:\s*(\d+)$/)

    let interval = setInterval(() =>
    {
        wsClient.send(`10-01-server: ${num}->${i++}`)
    }, 5000)

    wsClient.on('message', function(message) {
        process.stdout.write(message + '\n')

        let matches = message.toString().match(reg)

        num = matches[1]
    })

    wsClient.on('close', () =>
    {
        clearInterval(interval)
    })
})

http.createServer(requestsHandler).listen(3000)


function requestsHandler(req, res)
{
    let namepath = url.parse(req.url).pathname
    let path = './wsStart.html'

    if (req.method === 'GET' && namepath === '/start')
    {

        fs.stat(path, (err, stats) =>
        {

            let file = fs.readFileSync(path)

            res.writeHead(200, {'Content-Type': 'text/html', 'Content-Length': stats.size})
            res.end(file)
        })

        return
    }

    res.writeHead(400)
    res.end('/start')
}