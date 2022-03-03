const url = require("url");
const querystring = require("querystring");
const {parseString} = require("xml2js");
const xmlbuilder = require("xmlbuilder");
const multiparty = require('multiparty')

module.exports.postHandler = (req, res) =>
{
    let urlObject = url.parse(req.url)

    console.log('POST: ',urlObject.pathname)

    switch (urlObject.pathname)
    {
        case '/formparameter':

            requestDataHandler(req, (data) =>
            {
                let requestQuery = querystring.parse(data)

                res.write(`text: ${requestQuery.text}\n`)
                res.write(`number: ${requestQuery.number}\n`)
                res.write(`date: ${requestQuery.date}\n`)
                res.write(`checkbox: ${requestQuery.checkbox}\n`)
                res.write(`radiobutton: ${requestQuery.radio}\n`)
                res.write(`submit: ${requestQuery.submit}\n`)
                res.write(`textarea: \n${requestQuery.textarea}\n`)

                res.end()
            })

            break
        case '/json':

            requestDataHandler(req, (data) =>
            {
                let jsonObject = JSON.parse(data)

                let x = Number(jsonObject.x)
                let y = Number(jsonObject.y)

                let concatenation = `${jsonObject.message}: ${jsonObject.credentials.surname}, ${jsonObject.credentials.name}`

                let responseObject = {
                    '__comment': 'RESPONSE: LAB_8',
                    'x_plus_y': x + y,
                    'concatenation_s_o': concatenation,
                    'length_m': jsonObject.array.length
                }

                res.end(JSON.stringify(responseObject))
            })
            break
        case '/xml':

            requestDataHandler(req, (data) =>
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

            break

        case '/upload':

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
                res.end('ERROR')
            })

            form.on('close', () =>
            {
                res.end(result)
            })

            form.parse(req)
            break
    }
}

function requestDataHandler(req, callback)
{
    let data = ''

    req.on('data', (chunk) =>
    {
        data += chunk
    })

    req.on('end', ()=>
    {
        callback(data)
    })
}