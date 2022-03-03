
const http = require('http')
const querystring = require('querystring')

let post_data = '<request id="28">\n' +
    '    <x value="1"/>\n' +
    '    <x value="2"/>\n' +
    '    <m value="a"/>\n' +
    '    <m value="b"/>\n' +
    '    <m value="c"/>\n' +
    '</request>'

let post_options = {
    host: 'localhost',
    port: '3000',
    method: 'POST',
    headers: {
        'Content-Type': 'application/xml',
        'Content-Length': post_data.length
    }
};

// Set up the request
let post_req = http.request(post_options, function(res) {
    res.setEncoding('utf8')

    console.log(res.statusCode)

    res.on('data', d => {
        process.stdout.write(d)
    })
});

// post the data
post_req.write(post_data);
post_req.end();
