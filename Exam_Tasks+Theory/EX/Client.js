const rpcWSC = WebSocket = require('rpc-websockets').Client;
let ws = new rpcWSC('ws://localhost:4000'); //создаем сокет 

ws.on('open',()=>{ //если открыт сервер 
    ws.call('sub',[10,2,3,3]).then((r)=>{ //вызываем удаленно зарегистрированный rpc метод
        console.log('sub =', r);
    });

    ws.login( //логинимся для полученя доступа 
        {
            login: 'admin',
            password: 'admin'
        }
    ).then(()=>{

        ws.call('pow',[5,2]).catch((e)=>{ //данный метод с модиикатором протектед, поэтому нужно было залогиниться 
            console.log('catch: ',e);
        }).then((r)=>{
            console.log('fib = ',r);
        });

    });
})

process.on('unhandledRejection', (reason, p) => { //обработка ошибок
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  });