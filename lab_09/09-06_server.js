const http = require('http')
const {parseString} = require("xml2js");
const xmlbuilder = require("xmlbuilder");
const querystring = require('querystring')
const multiparty = require('multiparty')

http.createServer((req, res) =>
{
    let result = ''

    let form  = new multiparty.Form({uploadDir: './static'})

    form.on('field', (name, value) =>
    {
        console.log(name, value)
        result += `${name} = ${value}\n`
    })

    form.on('file', (name, file) =>
    {
        console.log(name, file)
        result += `${name} = ${file.originalFilename} : ${file.path}`
    })

    form.on('error', (err) =>
    {
        res.writeHead(400)
        res.end(err.toString())
    })

    form.on('close', () =>
    {
        res.writeHead(200, 'NoRmAlNo')
        res.end(result)
    })

    form.parse(req)
}).listen(3000)
