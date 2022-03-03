const http = require('http');
const fs = require('fs');
const url = require('url');
const qs = require('querystring');
const rpcWS = require('rpc-websockets').Server;

const file_path = './StudentList.json';

let getErrorJSON = (err_id, message) =>
{
    let json = [];
    json.push({error: err_id, message: message});
    return JSON.stringify(json);
}

let get_handler = (request, response) =>
{
    let path = url.parse(request.url).pathname;
    switch(true)
    {
        case path === '/':

            fs.readFile(file_path, (err, data) =>
            {
                response.setHeader('Content-Type', 'application/json');
                response.end(data);
            });
            break;

        case /\/\d+/.test(path):
            fs.readFile(file_path, (err, data) =>
            {
                let json = JSON.parse(data.toString());
                for (let i = 0; i < json.length; i++)
                {
                    if(json[i].id === Number(path.match(/\d+/)[0]))
                    {
                        response.setHeader('Content-Type', 'application/json');
                        response.write(JSON.stringify(json[i]));
                    }
                }

                if(!response.hasHeader('Content-Type'))
                {
                    response.setHeader('Content-Type', 'text/plain');
                    response.write(getErrorJSON(2, `студент с id ${Number(path.match(/\d+/)[0])} не найден`));
                }
                response.end();
            });
            break;

        case path == '/backup':
            fs.readdir('./backup', (err, files) =>
            {
                response.setHeader('Content-Type', 'application/json');
                let json = [];
                for (let i = 0; i < files.length; i++)
                {
                    json.push( { id: i, name: files[i]});
                }
                response.end(JSON.stringify(json));
                console.log(files.length);
            });
            break;
    }
};

let delete_handler = (request, response) =>
{
    let path = url.parse(request.url).pathname;
    switch (true)
    {
        case /\/backup\/\d+/.test(path):
            let flag = false;
            fs.readdir('./backup', (err, files) =>
            {
                for (let i = 0; i < files.length; i++)
                {
                    if (files[i].match(/\d{8}/)[0] > Number(path.match(/\d+/)))
                    {
                        flag = true;
                        fs.unlink(`./backup/${files[i]}`, (e) =>
                        {
                            if (e)
                            {
                                console.log('Error');
                                response.end(getErrorJSON(101, 'unknown error (delete_handler, deleting file by date)'));
                            }
                            else
                            {
                                console.log('Ok. Deleted');
                                response.end('Ok. Deleted');
                            }
                        });
                        rpc_server.emit('ListChangeEvent');
                    }
                }
                if (!flag)
                {
                    response.setHeader('Content-Type', 'text/plain');
                    response.end(getErrorJSON(4, "файлов с датой создания старше заданной не найдено"));
                }
            });
            break;

        case /\/\d+/.test(path):
            fs.readFile(file_path, (err, data) =>
            {
                let StudentFound = false;
                let json = JSON.parse(data.toString());
                let DeletedStudentId = Number(path.match(/\d+/)[0]);
                for (let i = 0; i < json.length; i++)
                {
                    if (json[i].id === DeletedStudentId)
                    {
                        response.setHeader('Content-Type', 'application/json');
                        response.write(JSON.stringify(json[i]));
                        json.splice(i, 1);
                        StudentFound = true;
                        break;
                    }
                }
                if(StudentFound)
                {
                    fs.writeFile(file_path, JSON.stringify(json), (e) =>
                    {
                        if (e)
                        {
                            console.log('Error');
                            response.write(getErrorJSON(100, 'unknown error (delete_handler, deleting student by id)'));
                        }
                        else
                        {
                            console.log('Ok. Deleted');
                            response.write('Ok. Deleted');
                        }
                        response.end();
                    });
                    rpc_server.emit('ListChangeEvent');
                }
                else
                {
                    response.end(getErrorJSON(3, `студент с id ${DeletedStudentId} не найден`));
                }
            });
            break;
    }
};

let post_handler = (request, response) =>
{
    let path = url.parse(request.url).pathname;
    switch(path)
    {
        case '/':
            let body = '';
            request.on('data', (data) => { body += data; });
            request.on('end', () =>
            {
                let newStudent = JSON.parse(body);
                fs.readFile(file_path, (err, data) =>
                {
                    let isStudentAlreadyInList = false;
                    let studentsList = JSON.parse(data.toString());
                    for (let i = 0; i < studentsList.length; i++)
                    {
                        if (studentsList[i].id == newStudent.id)
                        {
                            isStudentAlreadyInList = true;
                            break;
                        }
                    }

                    if(!isStudentAlreadyInList)
                    {
                        studentsList.push(newStudent);
                        fs.writeFile(file_path, JSON.stringify(studentsList), (e) =>
                        {
                            if (e)
                            {
                                console.log('Error');
                                response.end(getErrorJSON(102, 'unknown error (post_handler, adding new student)'));
                            }
                            else
                            {
                                console.log('Student is added');
                                response.end(JSON.stringify(newStudent));
                            }
                        });
                    }
                    else
                    {
                        response.setHeader('Content-Type', 'text/plain');
                        response.end(getErrorJSON(5, `студент с id ${newStudent.id} уже существует`));
                    }
                });
            });
            rpc_server.emit('ListChangeEvent');
            break;

        case '/backup':
            let date = new Date();
            console.log(date);
            console.log(date.getDate());
            setTimeout( () =>
            {
                fs.copyFile(file_path, `./backup/${date.getFullYear()}${date.getMonth()+1}${date.getDate()}${date.getHours()}${date.getMinutes()}_StudentList.json`, (err) =>
                {
                    if (err)
                    {
                        console.log('Error');
                        response.end(getErrorJSON(103, 'unknown error (post_handler, creating new file copy)'));
                    }
                    else
                    {
                        console.log('File is copied');
                        response.end('Ok');
                    }
                });
            }, 2000);
            break;
    }
};

let put_handler = (request, response) =>
{
    let path = url.parse(request.url).pathname;
    switch(path)
    {
        case '/':
            let body = '';
            request.on('data', function (data) { body += data; });
            request.on('end', function ()
            {
                fs.readFile(file_path, (err, data) =>
                {
                    let flag = false;
                    let json = JSON.parse(data.toString());
                    for (let i = 0; i < json.length; i++)
                    {
                        if (json[i].id === JSON.parse(body).id)
                        {
                            json[i] = JSON.parse(body);
                            fs.writeFile(file_path, JSON.stringify(json), (e) =>
                            {
                                if (e)
                                {
                                    console.log('Error');
                                    response.end(getErrorJSON(104, 'unknown error (put_handler, changing student)'));
                                }
                                else
                                {
                                    console.log('Student is altered');
                                    response.end(JSON.stringify(JSON.parse(body)));
                                }
                            });
                            flag = true;
                        }
                    }
                    if(!flag)
                    {
                        response.setHeader('Content-Type', 'text/plain');
                        response.end(getErrorJSON(6, `не существует студента с id ${JSON.parse(body).id}`));
                    }
                });
            });
            rpc_server.emit('ListChangeEvent');
            break;
    }
};

let server = http.createServer((request, response) =>
{
    switch(request.method)
    {
        case 'GET': get_handler(request, response); break;
        case 'POST': post_handler(request, response); break;
        case 'PUT': put_handler(request, response); break;
        case 'DELETE': delete_handler(request, response); break;
    }
}).listen(4000);

console.log('Сервер запущен, порт 3000');

//---------------------------------------------------------------
let rpc_server = new rpcWS({port:5000, host:'localhost'});
rpc_server.event('ListChangeEvent');
