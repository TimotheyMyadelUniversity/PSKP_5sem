const http = require('http')
const url = require('url')

const options = {
    hostname: 'localhost',
    port: 3000,
    method: 'GET',
}

let reqUrl = url.parse(url.format({
    protocol: 'http',
    hostname: 'localhost',
    port: 3000,
    query: {
        x: 3,
        y: 2
    }
}))

const req = http.request(reqUrl, res => {
    console.log(`statusCode: ${res.statusCode}`)

    res.on('data', d => {
        process.stdout.write(d)
    })
})

req.on('error', error => {
    console.error(error)
})

req.end()