const http = require('http');
const url = require('url');
let fs = require('fs');

const DB = require('./DataBaseService');
const { error } = require('console');

const DBExample = new DB();
const pathToHTML = './static/page.html';

let pipeFile = (response, headers) => 
{
    response.writeHead(200, headers);
    fs.createReadStream(pathToHTML).pipe(response);
};

let GET_handler = (req, res) => 
{
    switch (url.parse(req.url).pathname) 
    {
    case '/':
        {
            fs.access(pathToHTML, fs.constants.R_OK, err => //проверяет доступ пользователя к файлу, R_OK - можно прочитать вызывающим процессом 
            {
                if(err) this.writeHTTP404(res);
                else pipeFile(res,{'Content-Type':'text/html; charset=utf-8'});
            });
            break;
        }
    case '/api/faculties':
        {
            DBExample.getFaculties().then(records => 
            {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(records.recordset))
            }).catch(error => {write_error_400(res, error)});
            break;
        }
    case '/api/pulpits':
        {  
            DBExample.getPulpits().then(records => 
            {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(records.recordset))
            }).catch(error => {write_error_400(res, error)});
            break;
        }
    case '/api/subjects':
        { 
            DBExample.getSubjects().then(records => 
            {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(records.recordset))
            }).catch(error => {write_error_400(res, error)});
            break;
        }
    case '/api/auditoriumstypes':
        {
            DBExample.getAuditoriumTypes().then(records => 
            {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(records.recordset))
            }).catch(error => {write_error_400(res, error)});
        break;}
    case '/api/auditorims':
        {
            DBExample.getAuditoriums().then(records => 
            {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(records.recordset))
            }).catch(error => {write_error_400(res, error)});
            break;
        }
    default:
        {
            write_error_400(res,"wrong url");
            break;
        }
    }
}

/*
{
        "FACULTY": "БИиП",
        "FACULTY_NAME": "Издателькое дело и полиграфия"
} 

{
        "PULPIT": "ИСиТ",
        "PULPIT_NAME": "Иформационный систем и технологий ",
        "FACULTY": "ИДиП"
}

{
        "AUDITORIUM": "213",
        "AUDITORIUM_NAME": 213
        "AUDITORIUM_CAPACITY": 90,
        "AUDITORIUM_TYPE": "ЛК"
    }
  {
        "SUBJECT": "БLL",
        "SUBJECT_NAME": "Базы данных",
        "PULPIT": "ИСиТ"
    }
    {
        "AUDITORIUM_TYPE": "ЛБ-X2",
        "AUDITORIUM_TYPENAME": "Химическая лаборатория"
}
*/

let POST_handler = (req, res) => {
    let data_json = '';
    req.on('error',(error)=> {write_error_400(res, error)});
    switch (url.parse(req.url).pathname) 
    {
    case '/api/faculties':
        {
            req.on('data', chunk => {data_json += chunk;});

            req.on('end', () => 
            {
                try
                {
                    data_json = JSON.parse(data_json);
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    DBExample.postFaculties(data_json.FACULTY, data_json.FACULTY_NAME).then(records => 
                    {
                        res.end(JSON.stringify(data_json))
                    }).catch(error => {write_error_400(res, error)});
                }
                catch (error)
                {write_error_400(res, error.message);}
                
            });
            break;
        }
    case '/api/pulpits':
        {
            req.on('data', chunk => {data_json += chunk;});

            req.on('end', () => 
            {
                try
                {
                    data_json = JSON.parse(data_json);
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    DBExample.postPulpits(data_json.PULPIT, data_json.PULPIT_NAME, data_json.FACULTY).then(records => 
                    {
                        res.end(JSON.stringify(data_json))
                    }).catch(error => {write_error_400(res, error)});
                }
                catch (error)
                {write_error_400(res, error.message);}
               
            });
            break;
        }
    case '/api/subjects':
        {
            req.on('data', chunk => {data_json += chunk;});

            req.on('end', () => 
            {
                try
                {
                    data_json = JSON.parse(data_json);
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    DBExample.postSubjects(data_json.SUBJECT, data_json.SUBJECT_NAME, data_json.PULPIT).then(records => 
                    {
                        res.end(JSON.stringify(data_json))
                    }).catch(error => {write_error_400(res, error)});
                }
                catch (error)
                {write_error_400(res, error.message);}
                
            });
            break;
        }
    case '/api/auditoriumstypes':
        { 
            req.on('data', chunk => {data_json += chunk;});

            req.on('end', () => 
            {
                try
                {
                    data_json = JSON.parse(data_json);
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    DBExample.postAuditoriumsTypes(data_json.AUDITORIUM_TYPE, data_json.AUDITORIUM_TYPENAME).then(records => 
                    {
                        res.end(JSON.stringify(data_json))
                    }).catch(error => {write_error_400(res, error)});
                }
                catch (error)
                {write_error_400(res, error.message);}
               
            });
            break;
        }
    case '/api/auditorims':
        {
            req.on('data', chunk => {data_json += chunk;});

            req.on('end', () => 
            {
                try
                {
                    data_json = JSON.parse(data_json);
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    DBExample.postAuditoriums(data_json.AUDITORIUM, data_json.AUDITORIUM_NAME, data_json.AUDITORIUM_CAPACITY, data_json.AUDITORIUM_TYPE).then(records => 
                    {
                        res.end(JSON.stringify(data_json))
                    }).catch(error => {write_error_400(res, error)});
                }
                catch (error)
                {write_error_400(res, error.message);}
               
            });
            break;
        }
    default:
        {
            write_error_400(res,"wrong url");
            break;
        }
    }
}

let PUT_handler = (req, response) => {
    let data_json = '';
    switch (url.parse(req.url).pathname) 
    {
        case '/api/faculties':

            req.on('data', chunk => {data_json += chunk;});

            req.on('end', () => {
                data_json = JSON.parse(data_json);
                response.writeHead(200, {'Content-Type': 'application/json'});
                DBExample.getFaculty(data_json.FACULTY).
                then((res)=>
                {
                    if(res.recordset.length == 0) throw 'No such faculty'
                    else
                    DBExample.putFaculties(data_json.FACULTY, data_json.FACULTY_NAME).then(records => {
                        response.end(JSON.stringify(data_json))
                    }).catch(error => {write_error_400(response, error)});
                }).catch(error=>{write_error_400(response,error)});
               
            });
            break;
        case '/api/pulpits':

            req.on('data', chunk => {data_json += chunk;});

            req.on('end', () => 
            {
                data_json = JSON.parse(data_json);
                response.writeHead(200, {'Content-Type': 'application/json'});
                DBExample.getPulpit(data_json.PULPIT).then((res)=>{
                    if(res.recordset.length == 0) throw "No such pulpit"
                    else
                    DBExample.putPulpits(data_json.PULPIT, data_json.PULPIT_NAME, data_json.FACULTY).then(records => 
                        {
                            response.end(JSON.stringify(data_json))
                        }).catch(error => {write_error_400(response, error)})}
                    ).catch(error=>{write_error_400(response,error)});
            });
            break;
        case '/api/subjects':

            req.on('data', chunk => {data_json += chunk;});

            req.on('end', () => 
            {
                data_json = JSON.parse(data_json);
                response.writeHead(200, {'Content-Type': 'application/json'});
                DBExample.getSubject(data_json.SUBJECT).
                then((res)=>
                {
                    if(res.recordset.length == 0) throw 'No such subject'
                    else
                    DBExample.putSubjects(data_json.SUBJECT, data_json.SUBJECT_NAME, data_json.PULPIT).then(records => {
                        response.end(JSON.stringify(data_json))
                    }).catch(error => {write_error_400(response, error)})
                }).
                catch(error=>{write_error_400(response,error)});
                ;
            });
            break;
        case '/api/auditoriumstypes':

            req.on('data', chunk => {data_json += chunk;});

            req.on('end', () => 
            {
                data_json = JSON.parse(data_json);
                DBExample.getAuditoriumTypes(data_json.AUDITORIUM_TYPE).
                then((res)=>
                {
                    if(res.recordset.length == 0) throw 'No such auditorium_type'
                    else
                    DBExample.putAuditoriumsTypes(data_json.AUDITORIUM_TYPE, data_json.AUDITORIUM_TYPENAME).then(records => {
                        response.writeHead(200, {'Content-Type': 'application/json'});
                        response.end(JSON.stringify(data_json));
                    }).catch(error => {write_error_400(response, error)});
                }).
                catch(error=>{write_error_400(response,error)});

            });
            break;
        case '/api/auditorims':
            req.on('data', chunk => {data_json += chunk;});

            req.on('end', () => {
                data_json = JSON.parse(data_json);
                DBExample.getAuditorim(data_json.AUDITORIUM).
                then((res)=>
                {
                    if(res.recordset.length == 0) throw 'No such auditorium'
                    else
                    response.writeHead(200, {'Content-Type': 'application/json'});
                    DBExample.putAuditoriums(data_json.AUDITORIUM, data_json.AUDITORIUM_NAME, data_json.AUDITORIUM_CAPACITY, data_json.AUDITORIUM_TYPE).then(records => {
                        response.end(JSON.stringify(data_json)).catch(error => {write_error_400(res, error)})
                }).catch(error => {write_error_400(response, error)});
                }).
                catch(error=>{write_error_400(response,error)});
                
            });
            break;
            default:
            {
                write_error_400(res,"wrong url");
                break;
            }
    }
}

let DELETE_handler = (req, response) => {
    let path = decodeURI(url.parse(req.url).pathname);
    let path_mas= path.split('/');
    switch ('/api/' + path_mas[2]) 
    {
        case '/api/faculties':
            {
                response.writeHead(200, {'Content-Type': 'application/json'});

                DBExample.getFaculty(path_mas[3]).then((res)=>{
                    if(res.recordset.length == 0) throw 'No such faculty'
                    else
                    DBExample.deleteFaculties(path_mas[3]).then(records => {
                        response.end('deleted')
                    }).catch(error => {write_error_400(response, error)});
                })
                .catch(error=>{write_error_400(response,error)});

               

                break;
            }
        case '/api/pulpits':
            {
                response.writeHead(200, {'Content-Type': 'application/json'});

                DBExample.getPulpit(path_mas[3]).then((res)=>{
                    if(res.recordset.length == 0) throw 'No such pulpit'
                    else
                    DBExample.deletePulpits(path_mas[3]).then(records => {
                        response.end('deleted')
                    }).catch(error => {write_error_400(response, error)});
    
            })
                .catch(error=>{write_error_400(response,error)});

                
                break;
            }
        case '/api/subjects':
           {
                response.writeHead(200, {'Content-Type': 'application/json'});

                DBExample.getSubject(path_mas[3]).
                then((res)=>{if(res.recordset.length == 0) throw 'No such subject'
                else
                DBExample.deleteSubjects(path_mas[3]).
                then(records => {response.end('deleted')}).
                catch(error => {write_error_400(response, error)});
            
                }).
                catch(error=>{write_error_400(response,error)});

               

                break;
            }
        case '/api/auditoriumstypes':
            {
                res.writeHead(200, {'Content-Type': 'application/json'});

                DBExample.getAuditoriumTypes(path_mas[3]).
                then((res)=>{
                    if(res.recordset.length == 0) throw 'No such auditorium type'
                    else
                    DBExample.deleteAuditoriumsTypes(path_mas[3]).then(records => 
                        {
                            response.end('deleted')
                        }).catch(error => {write_error_400(response, error)});
                }).catch(error=>{write_error_400(response,error)});

               
                break;
            }
        case '/api/auditorims':
            {
                response.writeHead(200, {'Content-Type': 'application/json'});

                DBExample.get_Faculty(path_mas[3]).
                then((res)=>{
                    if(res.recordset.length == 0) throw 'No such auditorium'
                    DBExample.deleteAuditoriums(path_mas[3]).then(records => {
                        response.end('deleted')
                    }).catch(error => {write_error_400(response, error)});
                
                }).catch(error=>{write_error_400(response,error)
                });              
                break;
            }
        default:
            write_error_400(res,"wrong url");
            break;
    }
}

function write_error_400(res, message) 
{
    res.statusCode = 400;
    res.statusMessage = 'Invalid method';
    if(typeof(message) == 'string')
    {
        let errorJSON = {originalError:{info:{message}}};
        res.end(JSON.stringify(errorJSON));
    }
    else
    {
        res.end(JSON.stringify(message));
    }
}


let http_handler = (req, res) => 
{

    console.log(req.method);
    switch (req.method) {
        case 'GET':
            GET_handler(req, res);
            break;
        case 'POST':
            POST_handler(req, res);
            break;
        case 'PUT':
            PUT_handler(req, res);
            break;
        case 'DELETE':
            DELETE_handler(req, res);
            break;
        default:
            write_error_400(res, 'Wrong method');
            break;
    }
}



let server = http.createServer();
server.listen(3000, () => {console.log('http://localhost:3000')}).on('request', http_handler);

server.on('connection', (sock) => {

    sock.on('close', data => {
        console.log('Connection closed');
    });

    sock.on('error', (e) => {
        console.log(`Server error: ${e}`);
    });
});
