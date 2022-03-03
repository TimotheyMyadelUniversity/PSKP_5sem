const http = require('http');
var state = 'norm';

http.createServer(function(req,res){
    res.contentType = 'text/html';
    res.end('<h3>norm</h3>');
}).listen(5000);
console.log('Server running at http://localhost:5000/');

process.stdin.setEncoding('utf-8');
process.stdin.on('readable',()=>{
    let chunk = null;
    while ((chunk = process.stdin.read()) != null){
        if (chunk.trim() == 'exit')     process.exit(0);
        else if(chunk.trim() == 'stop') {process.stdout.write('reg = '+ state.toString() + '--> stop\n'); state = 'stop';}
        else if(chunk.trim() == 'test') {process.stdout.write('reg = '+ state.toString() + '--> test\n'); state = 'test';}
        else if(chunk.trim() == 'idle') {process.stdout.write('reg = '+ state.toString() + '--> idle\n'); state = 'idle';}
        else if(chunk.trim() == 'norm') {process.stdout.write('reg = '+ state.toString() + '--> norm\n'); state = 'norm';}
        else {process.stdout.write(chunk.toString());}
    }
});