const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;

class DB {
    constructor() {
        this.url = 'mongodb://Evgeniy:Evgeniy@bstu-shard-00-00.e1trf.mongodb.net:27017,bstu-shard-00-01.e1trf.mongodb.net:27017,bstu-shard-00-02.e1trf.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-b889rv-shard-0&authSource=admin&retryWrites=true&w=majority';
        this.client = new MongoClient(this.url);
        this.client = this.client.connect().then(connection => {return connection.db("BSTU")});
        console.log("Connected to MongoDB");
    }

    GetRecordsByTableName(tableName) {
        return this.client.then(db => {
            return db.collection(tableName).find({}).toArray();
        });
    }
  /*  
    {
    "faculty": "ИЭ",
    "faculty_name": "Инженерно-экономический"
}
{
    "faculty": "ИТ",
    "faculty_name": "Информационных технологий"
}
*/

/* 
{
    "pulpit": "ИСиТ",
    "pulpit_name": "Информационных систем и технологий",
    "faculty": "ИТ"
} 

{
    "pulpit": "ПИ",
    "pulpit_name": "Программной инженерии",
    "faculty": "ИТ"
} 

*/
/* 
{
    "_id": "61acf775ebb1dc58819de9e1",
    "pulpit": "ИСиТ",
    "pulpit_name": "Информационных систем",
    "faculty": "ИТ"
} 

    {
        "_id": "61acf6caebb1dc58819de9e0",
        "faculty": "ИТИ",
        "faculty_name": "Информационных технологий"
    }
*/
    InsertRecords(tableName,tableColumn,code, fields) { //
        return this.client
            .then(async db => {
                let tableCol= JSON.parse('{"'+ tableColumn + '": "'+ code +'"}');
                console.log(code);
                await db.collection(tableName).findOne(tableCol).then(record => { //если находим такую запись
                    if (record) throw 'Дублирование записи';
                    return record;});
                db.collection(tableName).insertOne(fields, (err, r) =>{ //если не нашли и ошибку не выдало, то вставляем запись 
                    if(err) console.log(err);
                    else {
                        console.log(r.insertedCount);
                    }
                });
                return this.GetRecord(tableName, tableCol);
            });
    }

    UpdateRecords(tableName, id, fields) {
        return this.client
            .then(async db => {
                console.log(id);
                if (!id) {
                    throw "Неверный ID"; //если мы хотим изменить запись с айди, которого не нашлось, то ошибка
                }
                delete fields._id; //удаляем поле с айди
                await this.GetRecord(tableName, {_id: ObjectId(id)});
                await db.collection(tableName).updateOne({_id: ObjectId(id)}, {$set: fields}); //изменяем 
                return this.GetRecord(tableName, fields);
            })
    }

    GetRecord(tableName, fields) {
        return this.client
            .then(db => {
                return db.collection(tableName).findOne(fields);
            })
            .then(record => {
                if (!record) throw 'Нет записей';
                return record;
            });
    }

    IsFacultyExist(code) {
        let tableCol = JSON.parse('{"faculty": "'+ code +'"}');
        return this.client
            .then(db => {
                return db.collection('faculty').findOne(tableCol);
            })
            .then(record => {
                if (!record) return false;
                return true;
            });
    }

    DeleteRecord(tableName,tableColumn, code) {
        return this.client
            .then(async db => {
                if (!code) {
                    throw 'Неверный факультет';
                }
                console.log("DB delete");
                let tableCol= JSON.parse('{"'+ tableColumn + '": "'+ code +'"}');
                let removedRecord = await this.GetRecord(tableName, tableCol);
                await db.collection(tableName).deleteOne(tableCol);
                return removedRecord;
            });
    }

}

module.exports = DB;
