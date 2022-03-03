const http = require('http')
const {parseString} = require("xml2js");
const xmlbuilder = require("xmlbuilder");
const querystring = require('querystring')

http.createServer((req, res) =>
{
    let data = ''

    req.on('data', chunk =>
    {
        data += chunk
    })



    req.on('end', () =>
    {
        let xmlObject = null

        parseString(data, (err, result)=>
        {
            if (err)
            {
                console.log(err)
            }

            xmlObject = result
        })

        let sum = 0;

        xmlObject.request.x.map((e, i) =>
        {

            sum += Number(e.$.value)
        })
        let concatStr = ''

        xmlObject.request.m.map((e, i) =>
        {

            concatStr += e.$.value
        })

        let id = xmlObject.request.$.id

        let xmlDoc = xmlbuilder.create('response', ).att('request', id)
        xmlDoc.ele('sum', {'element': 'x', 'result': sum})
        xmlDoc.ele('concat', {'element': 'm', 'result': concatStr})

        res.writeHead(200, {'Content-Type': 'application/xml'})
        res.end(xmlDoc.end({pretty:true}));
    })
}).listen(3000)
