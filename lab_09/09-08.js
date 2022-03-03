var http =require('http');
const fs=require('fs');
let options=
    {
        host: 'localhost',
        path: '/task8',
        port: 3000,
        method:'GET'
    }
const req = http.request(options,(res)=>
{
    res.pipe(fs.createWriteStream('file.png'));
});

req.end();