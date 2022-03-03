const rpcWSS = require('rpc-websockets').Client;

const ws = new rpcWSS('ws://localhost:5000');
ws.on('open', () =>
{
    ws.subscribe('ListChangeEvent');
    ws.on('ListChangeEvent', ()=>{console.log('->ListChanged notification')});
});