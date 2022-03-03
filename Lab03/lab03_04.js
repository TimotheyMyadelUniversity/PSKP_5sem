const http = require('http');
const url = require('url');
const fs = require('fs');
const process = require("async");

const async_factorial = function (n, callback) {
    let fact = 1;
    process.nextTick(function () {
        for (let i = 1; i <= n; i++) {
            fact = fact * i;
        }
        callback(fact);
    });
};

http.createServer(function (req, res)
    {
        let parsedUrl = url.parse(req.url, true); // true to get query as object
        let queryAsObject = parsedUrl.query;

        let path;
        if (req.method === "GET") {
            if (parsedUrl.pathname === "/fact") {
                let k = queryAsObject.k;
                res.writeHead(200, {'Content-Type': 'text/json'});
                async_factorial(k, function (fact)
                {
                   res.end(JSON.stringify({k: k, fact: fact}));
                });
            }

            if (parsedUrl.pathname === "/") {
                path = "03-04.html"

                fs.stat(path, (err, stats) => {
                        if (err != null) {
                            console.log(err);
                        }

                        let text = fs.readFileSync(path);
                        res.writeHead(200, {"Content-Type": "text/html; charset=utf-8", "Content-Length": stats.size});
                        res.end(text, "binary");
                    }
                );
            }
        }
    }
).listen(5000);