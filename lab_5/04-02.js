const http = require('http')
const url = require('url')
const fs = require('fs')
const readline = require('readline');
const DB = require('./DB')

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: `server->`
});

let dataCollecting = false
let commits = 0
let requests = 0

let timeout = null
let statTimeout = null
let interval = null

process.stdin.unref();

let db = new DB.DB()


let stat = {
    startTime: "",
    endTime: "",
    requests: 0,
    commits: 0
}

db.on('GET', (req, res) =>
{
    if (dataCollecting)
    {
        requests++
    }
    res.end(JSON.stringify(db.select()))
})

db.on('POST', (req, res) =>
{
    if (dataCollecting)
    {
        requests++
    }
    req.on('data', (data) =>
    {
        let newLine = JSON.parse(data)
        db.insert(newLine)
    })
    res.writeHead(200);
    res.end("OK")
})

db.on('PUT', (req, res) =>
{
    if (dataCollecting)
    {
        requests++
    }
    req.on('data', (data) =>
    {
        let newLine = JSON.parse(data)
        db.update(newLine)
    })
    res.writeHead(200);
    res.end("OK")
})

db.on('DELETE', (req, res) =>
{
    if (dataCollecting)
    {
        requests++
    }
    let queryData = url.parse(req.url, true).query
    let id = queryData.id
    let line = db.delete(id)

    res.end(JSON.stringify(line))
})

const server= http.createServer(((req, res) =>
{
    req.socket.unref()

    switch (url.parse(req.url).pathname)
    {
        case '/':
            fs.readFile('./index.html', (err, data) =>
            {
                if(err)
                {
                    throw err;
                }
                res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
                res.end(data);
            });
            break;
        case '/api/db':
            db.emit(req.method, req, res)
            break;
        case '/api/ss':
            res.end(JSON.stringify(stat))
            break;
        default:
            break;
    }
})).listen(3000)

rl.prompt();
rl.on('line', (line) => {
    let args = line.split(' ')
    switch (args[0]) {
        case 'sd':
            if (args[1])
            {
                timeout = setTimeout(() => server.close(), args[1] * 1000)
            }
            else
            {
                clearTimeout(timeout)
            }
            break;
        case 'sc':
            if (args[1])
            {
                interval = setInterval(() =>
                {
                    db.commit()
                    if (dataCollecting)
                    {
                        commits++
                    }
                }, args[1] * 1000).unref()
            }
            else
            {
                clearInterval(interval)
            }
            break
        case 'ss':
            if (args[1])
            {
                stat.startTime = new Date().toISOString().slice(0,10)
                requests = 0
                commits = 0
                dataCollecting = true

                statTimeout = setInterval(() =>
                {
                    commitStat()
                }, args[1] * 1000).unref()
            }
            else
            {
                clearInterval(statTimeout)

                commitStat()
            }
            break
        default:
            console.log(line);
            break
    }
    rl.prompt();
}).on('close', () => {
    server.close()
});

function commitStat()
{
    stat.requests = requests
    stat.commits = commits
    stat.endTime = new Date().toISOString().slice(0,10)

    requests = 0
    commits = 0
    dataCollecting = false
}