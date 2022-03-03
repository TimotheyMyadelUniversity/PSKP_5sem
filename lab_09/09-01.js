const http = require('http')
const options = {
    hostname: 'localhost',
    port: 3000,
    method: 'GET'
}

const req = http.request(options, res => {
    console.log(`statusCode: ${res.statusCode}`)
    console.log(`statusMessage: ${res.statusMessage}`)
    console.log(`IP: ${res.socket.remoteAddress}`)
    console.log(`PORT: ${res.socket.remotePort}`)

    res.on('data', d => {
        process.stdout.write(d)
    })
})

req.on('error', error => {
    console.error(error)
})

req.end()