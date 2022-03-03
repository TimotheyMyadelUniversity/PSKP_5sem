var rps_client = require('rpc-websockets')

const ws = new rps_client.Client('ws://localhost:3000');

const loginOptions = {
    login: 'admin',
    password: 'admin'
}

ws.on('open', () => {
    ws.login(loginOptions).then(() => {
        ws.call('pow', [5,4])
            .then(result => console.log(result))
            .catch(error => console.log(error));
    }).catch(error => console.log(error));
});