const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:4000')

ws.on('open', () =>
{
    console.log('open')
})

ws.on('close', () =>
{
    console.log('close')
})

ws.on('message', (message) =>
{
    console.log(message.toString())
})

let i = 0

let interval = setInterval(() =>
{
    ws.send(`10-02-client: ${i++}`)
}, 3000)

let timeout = setTimeout(() =>
{
    clearInterval(interval)
    ws.close()
}, 25000)