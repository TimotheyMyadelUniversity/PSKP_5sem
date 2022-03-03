const http = require('http')
const querystring = require('querystring')

let post_data = JSON.stringify({
    __comment: "REQUEST: LAB_8",
    x: 1,
    y: 2,
    message: "message",
    array: ["a", "b", "c", "d"],
    credentials: {
        surname: "Ivanov",
        name: "Ivan"
    }
})

let post_options = {
    host: 'localhost',
    port: '3000',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
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
