const WebSocket = require('ws');

const wsServer = new WebSocket.Server( 
    {
        port:5000, 
        host:'localhost'
    }
);

let n = 1;
let i = 0;
let activeClient = 0;
wsServer.on('connection',(ws)=>
{
    ws.on('message', (data)=>{
        data2 =  JSON.parse(data);
        console.log('on message: ', data);
        ws.send(JSON.stringify({ server: ++i, client: data2.client ,timestamp: new Date(), randomNumber:  Math.random() * (10 - 0) + 0 }));
    });
    

    //сколько понгов будет - столько клиентов слушает нас
    ws.on('pong', data =>                      
    {
        if(data == 1) activeClient+=0.5;
    });

    setInterval(() =>                          
    {
        wsServer.clients.forEach(client =>     
        {
            client.ping(1);
        });
        console.log('Active: ' + (activeClient)); 
        activeClient = 0;                         

    }, 5000);

    
});