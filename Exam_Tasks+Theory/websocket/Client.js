const WebSocket = require('ws');
const ws = new WebSocket('ws://localhost:5000');

let parm1 = process.argv[2]; 
let parm2 = process.argv[3];
let prfx1 = typeof parm1 == 'undefined' ? 'Client' : parm1; 
let prfx2 = typeof parm2 == 'undefined' ? 'Client' : parm2; 



ws.on('ping', (data) =>   
{
    ws.pong(data);
})
.on('open', () => {
    let k = 0;
    setInterval(() => { ws.send(JSON.stringify({ client: prfx1, timestamp: new Date(), number:prfx2 }))}, 10000); 
})
.on('error', (e)=> {console.log('WS server error ', e);})
.on('message', (data)=>{
    data2 =  JSON.parse(data); 
    console.log('on message: ', data);
});  
ws.onmessage = (e) => {console.log("Message server: ", e.data);};   

