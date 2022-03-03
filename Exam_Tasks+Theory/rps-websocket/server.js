var rps_serv = require('rpc-websockets')
var fs = require('fs');

const server = new rps_serv.Server({
    port: 3000,
    host: 'localhost'
});

server.setAuth((x) => {
    return x.login === 'admin' && x.password === 'admin';
});

server.register('refillBalance', (params) => {
    const userUpdateData = {
        userName: params[0],
        n: params[1]
    }

    checkInputOptionsOnCorrect(userUpdateData);

    let data = JSON.parse(fs.readFileSync("data.json"));

    const userUpdateIndex = data.findIndex(x => x.userName === userUpdateData.userName);

    if (userUpdateIndex === -1) {
        throw new Error('Пользователь не найден');
    }

    let user = data.find(x => x.userName === userUpdateData.userName);

    user.n += userUpdateData.n;
    data.splice(userUpdateIndex, 1, user);

    fs.writeFileSync('data.json', JSON.stringify(data));

    return user.n;
}).protected();

function checkInputOptionsOnCorrect(userUpdateData) {
    if (userUpdateData.userName === undefined) {
        throw new Error('Имя пользователя не задано');
    }

    if (userUpdateData.n === undefined) {
        throw new Error('Число n не задано');
    }

    if (isNaN(userUpdateData.n)) {
        throw new Error('Число n должно иметь числовой тип данных');
    }
}