const url = require("url");
const path = require("path");
const fs = require("fs");

const mimeDict = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.png': 'image/png',
    '.docx': 'application/msword',
    '.json': 'application/json',
    '.xml': 'application/xml',
    '.mp4': 'video/mp4',
}

module.exports.get_handler = (dir, res, req) =>
{
    let urlObject = url.parse(req.url)
    let filePath = dir + urlObject.pathname
    let fileExtension = path.parse(urlObject.pathname).ext
    console.log(filePath)
    console.log(fileExtension)

    if (req.method === 'GET')
    {
        if (fileExtension === '')
        {
            res.writeHead(404)
            res.end('File path does not specified')
            return
        }

        if (fs.existsSync(dir + urlObject.pathname))
        {
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
        res.end('File does not exists')

        return
    }

    res.writeHead(405)
    res.end('GET requests only')
}