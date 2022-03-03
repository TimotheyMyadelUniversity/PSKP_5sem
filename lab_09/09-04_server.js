const http = require('http')
const url = require('url')
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
        let jsonObject = JSON.parse(data)

        let x = Number(jsonObject.x)
        let y = Number(jsonObject.y)

        let concatenation = `${jsonObject.message}: ${jsonObject.credentials.surname}, ${jsonObject.credentials.name}`

        let responseObject = {
            '__comment': 'RESPONSE: NE LAB_8',
            'x_plus_y': x + y,
            'concatenation_s_o': concatenation,
            'length_m': jsonObject.array.length
        }

        res.end(JSON.stringify(responseObject, null, '\t'))
    })
}).listen(3000)
