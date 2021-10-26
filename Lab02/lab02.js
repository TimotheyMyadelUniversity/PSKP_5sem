var http = require('http');
var fs = require('fs');

http.createServer(function(req,res){
    
    if(req.url === '/html'){
        fs.readFile('index.html',(err, data) =>{
            if(err) throw err;
            else{
                res.end(data);
                console.log('Server running. Successfuly rode index.html')
            }
        });
    }

    else if(req.url === '/png')
    {
        var fname = "pic.jpg"
        let jpg = null;
    
        fs.stat(fname, (err, stats) =>
        {
            if (err != null)
            {
                console.log(err);
            }
    
            jpg = fs.readFileSync(fname);
            res.writeHead(200, {"Content-Type": "image/jpg", "Content-Length": stats.size});
            res.end(jpg, "binary");
        });
    }

    else if(req.url === '/api/name'){
        var fname = 'name.txt';
        var ftext = null;
        if(req.method === "GET"){
            fs.stat(fname,(err, stats)=>{
                if(err!=null) {
                    console.log(err);
                }
                ftext = fs.readFileSync(fname);
                res.writeHead(200,{'Content-Type': 'text/plain; charset=utf-8', 'Content-Length':stats.size});
                res.end(ftext, "binary");
            });
        }
    }

    else if(req.url === '/xmlhttprequest'){
        var fname = 'xmlhttprequest.html';
        if(req.method === "GET"){
            fs.readFile(fname,'utf8',function (err,data) {
                res.end(data);
            });
        }
    }

    else if(req.url === '/fetch'){
        var fname = 'fetch.html';
        if(req.method === 'GET'){
            fs.readFile(fname,'utf-8',function(err,data){
                res.end(data);
            });
        }
    }

    else if(req.url === '/jquery'){
        var fname = 'jquery.html'
        if(req.method === 'GET'){
            fs.readFile(fname,'utf-8',function(err,data){
                res.contentType = 'text/plain';
                res.end(data);
            });
        }
    }
}).listen(8080);

console.log(`Server is listening on 8080`);