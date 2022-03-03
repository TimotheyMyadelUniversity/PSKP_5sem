var http = require('http');
var fs = require('fs');


let GET_handler = (req, res) => {
    var parseUrl = require('url').parse(req.url);

    if (parseUrl.pathname.includes("/users/")) {
        var id = parseUrl.pathname.replace("/users/", "");
        console.log("Id: " + id);

        pool.connect().then(() => {
            pool.request().query(`select * from Users where Users.id = ${id}`, (err, result) => {
                if (err) {
                    res.end(JSON.stringify({
                        code: 1,
                        message: `User with Id: ${id} does not exist`
                    }))
                }
                else if(result.recordset == '') {
                    res.end(JSON.stringify({
                        code: 1,
                        message: `User with Id: ${id} does not exist`
                    }))
                } 
                else {
                    console.log(result.recordset);
                    res.end(JSON.stringify(result.recordset));
                }
                pool.close();
            });
        });
    } else if (parseUrl.pathname === '/') {
        res.writeHead(200, {
            'Content-Type' : 'text/html;charset=utf-8'
        });
        res.end(html);
    }


    console.log(parseUrl);

}

let http_handler = (req, res) => {
    res.writeHead(200, {
        "Content-Type": "application/json; charset=utf-8"
    })
    console.log(req.method, " - ", req.url);
    GET_handler(req, res);
}

let server = http.createServer();
server.listen(3000, (v) => {
    console.log("server.listen(3000)");
}).on('error', (e) => {
    console.log("server.listen(3000); error: ", e);
}).on('request', http_handler);


var sql = require('mssql/msnodesqlv8');
const pool = new sql.ConnectionPool({
    database: "Exam",
    server: "PYROG",
    driver: "msnodesqlv8",
    options: { trustedConnection: true }
});
// user: XXX, password: YYY
