const rpcWSS = require('rpc-websockets').Server; //rpc server for rpc methods (удаленный вызов процедур)

let server = new rpcWSS(
    {
        port:4000,
        host:'localhost'
    }
);

server.setAuth(
    credentials=>
    credentials.login === 'admin' &&
    credentials.password === 'admin'
);

server.register('sub',(params)=>
{
    var i;
    let sum = 0;
    for(i = 1;i < params.length;i++)
    {
        sum += params[i];
    }
    let result = params[0] - sum;
    return result;
}).public(); //зарегистрировали метод ssquare и указали модификатор доступа public

server.register('pow', (params)=>{ //метод с подификатором protected
 return Math.pow(params[0],params[1]);
}).protected();

process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  });