const url = require("url");
const querystring = require("querystring");
const fs = require("fs");
const path = require("path");

const dir = 'static'

const mimeDict = {
    '.html': 'text/html',
    '.txt': 'text/plain',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.png': 'image/png',
    '.docx': 'application/msword',
    '.json': 'application/json',
    '.xml': 'application/xml',
    '.mp4': 'video/mp4',
}

module.exports.getHandler = (req, res, server) =>
{
    let urlObject = url.parse(req.url)
    let queryObject = querystring.parse(urlObject.query)

    console.log('GET: ', urlObject.pathname)

    switch (urlObject.pathname) {
        case '/connection':
            let timeout = queryObject.set;
            if (timeout) {
                server.keepAliveTimeout = Number(timeout);
                res.end(`KeepAliveTimeout=${timeout}`)
                return
            }

            res.end(server.keepAliveTimeout.toString())
            break
        case '/headers':

            // noinspection SpellCheckingInspection
            res.setHeader('moy-header', 'moe znachenie')

            let reqHeaders = ''
            for (let key in req.headers) {
                reqHeaders += `${key}: ${req.headers[key]}\n`
            }

            // let resHeaders = ''
            // for(let key in res.getHeaders())
            // {
            //     resHeaders += `${key}: ${res.headers[key]}\n`
            // }
            //
            // console.log(res.getHeaders())
            // console.log(resHeaders)

            res.end(`REQUEST:\n${reqHeaders}\nRESPONSE:`)
            break
        case '/parameter':
            let x = Number(queryObject.x)
            let y = Number(queryObject.y)

            if (!isNaN(x) && !isNaN(y)) {
                res.write(`${x} + ${y} = ${x + y}\n`)
                res.write(`${x} - ${y} = ${x - y}\n`)
                res.write(`${x} * ${y} = ${x * y}\n`)
                res.write(`${x} / ${y} = ${x / y}\n`)
                res.end()
                return
            }

            res.writeHead(400)
            res.end('x or y is not a number')

            break
        case '/close':
            setTimeout(() => server.close(), 10000)
            res.end('server will be stopped after 10 sec')
            break
        case '/socket':
            res.write(`YOUR IP: ${req.socket.remoteAddress}\n`)
            res.write(`YOUR PORT: ${req.socket.remotePort}\n`)
            res.write(`SERVER IP: ${req.socket.localAddress}\n`)
            res.write(`SERVER PORT: ${req.socket.localPort}\n`)
            res.end()
            break
        case '/req-data':
            let chunkCount = 0;

            req.on('data', (chunk) => {
                chunkCount++;
                console.log(`Chunk: ${chunkCount}`);
            })

            res.end('OK')
            break
        case '/resp-status':

            let status = Number(queryObject.code)
            let message = queryObject.mess

            res.writeHead(status, message)
            res.end()
            break

        case '/files':

            fs.readdir(dir, (err, files) => {
                res.setHeader('x-static-files-count', files.length)
                res.end()
            });

            break

        case '/upload':

            let file = fs.readFileSync('./upload.html')

            res.writeHead(200, {'Content-Type': 'text/html'})
            res.end(file)

            break

        default:
            let parameterRgxMatches = urlObject.pathname.match('^\/parameter\/(.+)\/(.+)$')

            if (parameterRgxMatches) {
                let x = Number(parameterRgxMatches[1])
                let y = Number(parameterRgxMatches[2])

                if (!isNaN(x) && !isNaN(y)) {
                    res.write(`${x} + ${y} = ${x + y}\n`)
                    res.write(`${x} - ${y} = ${x - y}\n`)
                    res.write(`${x} * ${y} = ${x * y}\n`)
                    res.write(`${x} / ${y} = ${x / y}\n`)
                    res.end()
                    return
                }

                res.writeHead(400)
                res.end(urlObject.pathname)

                return
            }
            else if (urlObject.pathname.includes('/files/'))
            {
                let filename = urlObject.pathname.replace('/files/', '')
                let filePath = dir + '/' + filename
                if (fs.existsSync(filePath))
                {
                    let fileExtension = path.parse(filename).ext
                    let mime = mimeDict[fileExtension]

                    fs.stat(filePath, (err, stats) =>
                    {
                        if (err != null)
                        {
                            console.log(err);
                        }

                        let file = fs.readFileSync(filePath);

                        res.writeHead(200, {
                            "Content-Type": mime,
                            "Content-Length": stats.size,
                            "Access-Control-Allow-Origin": "*"
                        });
                        res.end(file, "binary");
                    })

                    return
                }

                res.writeHead(404)
                res.end('ERROR')

                return
            }

            res.writeHead(400)
            res.end('ERROR')
    }
}