const util = require('util')
const ee = require('events')

let db_data = [
    {'id': 1, 'name': 'knvklnvlkdnvkld', 'bday': '2001-01-01'},
    {'id': 2, 'name': 'klmlkmklmop', 'bday': '2001-01-02'},
    {'id': 3, 'name': 'asdasdasdqweqwe', 'bday': '2001-01-03'},
    {'id': 4, 'name': 'eewrwfevferdwc', 'bday': '2001-01-04'},
    {'id': 5, 'name': 'knjnbiuvcytxckmojn', 'bday': '2001-01-05'}
];

function DB()
{
    this.insert = (newLine) =>
    {
        db_data.push(newLine)
    }

    this.select = () =>
    {
        return db_data
    }

    this.delete = (id) =>
    {
        let index = db_data.findIndex(x => x.id === Number(id))
        let elementJson = db_data[index]
        db_data.splice(index, 1)

        return elementJson;
    }

    this.update = (newLine) =>
    {
        let index = db_data.findIndex(x => Number(x.id) === Number(newLine.id))
        if (index !== -1)
        {
            db_data[index] = newLine
            return true
        }

        return false
    }
}

util.inherits(DB, ee.EventEmitter)

exports.DB = DB