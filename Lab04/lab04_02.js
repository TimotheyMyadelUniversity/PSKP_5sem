const http = require('http')
const url = require('url')
const fs = require('fs')
const DB = require('./DB')

let db = new DB.DB()

db.on('GET', (req, res) =>
{
    res.end(JSON.stringify(db.select()))
})

db.on('POST', (req, res) =>
{
    req.on('data', (data) =>
    {
        let newLine = JSON.parse(data)
        db.insert(newLine)
    })
    res.writeHead(200)
    res.end("OK")
})

db.on('PUT', (req, res) =>
{
    req.on('data', (data) =>
    {
        let newLine = JSON.parse(data)
        db.update(newLine)
    })
    res.writeHead(200)
    res.end("OK")
})

db.on('DELETE', (req, res) =>
{
    let queryData = url.parse(req.url, true).query
    let id = queryData.id
    let line = db.delete(id)

    res.end(JSON.stringify(line))
})

http.createServer(((req, res) =>
{
    switch (url.parse(req.url).pathname)
    {
        case '/':
        {
            fs.readFile('./index.html', (err, data) =>
            {
                if(err)
                {
                    throw err
                }
                res.writeHead(200, {"Content-Type": "text/html charset=utf-8"})
                res.end(data)
            })
        }
            break
        case '/api/db':
        {
            db.emit(req.method, req, res)
        }
            break
        default:
            break
    }
})).listen(3000)