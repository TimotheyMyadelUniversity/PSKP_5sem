const sql = require('mssql');

const config = {
    user: 'PyrogLogin',
    password: 'Pyrog123',
    server: 'PYROG',
    database: 'IMS',
    port: 1433,
    trustServerCertificate: true,
};

class DataBaseService{

    constructor() {
        this.connectionPool = new sql.ConnectionPool(config).connect().then((pool) => 
            {
            console.log(`Connected to SQL Server database ${config.database}`);
            return pool
            }).catch(err => console.log('Connection Failed: ', err));
    }



    getFaculties()
    {
        return this.connectionPool.then(pool => pool.request().query('Select * FROM FACULTY'))
    }

    getPulpits()
    {
        return this.connectionPool.then(pool => pool.request().query('Select * FROM PULPIT'))
    }
    getSubjects()
    {
        return this.connectionPool.then(pool => pool.request().query('Select * FROM SUBJECT'))
    }
    getAuditoriumTypes()
    {
        return this.connectionPool.then(pool => pool.request().query('Select * FROM AUDITORIUM_TYPE'))
    }
    getAuditoriums()
    {
        return this.connectionPool.then(pool => pool.request().query('Select * FROM AUDITORIUM'))
    }

    //request.input - Add an input parameter to the request. (name, type, value)
    getPulpit(pulpit)
    {
        return this.connectionPool.then(pool => {
            return pool.request().input('pulp',sql.NVarChar, pulpit).query('Select * from PULPIT where pulpit = @pulp')});
    }

    getFaculty(faculty)
    {
        return this.connectionPool.then(pool => {
            return pool.request().input('fac',sql.NVarChar, faculty).query('Select * from FACULTY where faculty = @fac')});
    }

    getSubject(subject)
    {
        return this.connectionPool.then(pool => {
            return pool.request().input('sub',sql.NVarChar, subject).query('Select * from Subject where subject = @sub')});
    }
    getAuditorim(audit)
    {
        return this.connectionPool.then(pool => {
            return pool.request().input('audit',sql.NVarChar, audit).query('Select * from AUDITORIUM where AUDITORIUM = @audit')});
    }
    getAuditoriumTypes(audit)
    {
        return this.connectionPool.then(pool => {
            return pool.request().input('audit',sql.NVarChar, audit).query('Select * from AUDITORIUM_TYPES where AUDITORIUM_TYPE = @audit')});
    }

    postFaculties(faculty,faculty_name)
    {
        return this.connectionPool.then(pool =>
            {
                return pool.request()
                .input('faculty',sql.NVarChar,faculty)
                .input('faculty_name',sql.NVarChar,faculty_name)
                .query('INSERT FACULTY(FACULTY,FACULTY_NAME) values(@faculty,@faculty_name)');
            });
    }

    postPulpits(pulpit, pulpit_name, faculty){
        return this.connectionPool.then(pool => {
            return pool.request()
                .input('pulpit', sql.NVarChar, pulpit)
                .input('pulpit_name', sql.NVarChar, pulpit_name)
                .input('faculty', sql.NVarChar, faculty)
                .query('INSERT PULPIT(PULPIT, PULPIT_NAME, FACULTY) values(@pulpit , @pulpit_name, @faculty)');
        });
    }

    postSubjects(subject, subject_name, pulpit){
        return this.connectionPool.then(pool => {
            return pool.request()
                .input('subject', sql.NVarChar, subject)
                .input('subject_name', sql.NVarChar, subject_name)
                .input('pulpit', sql.NVarChar, pulpit)
                .query('INSERT SUBJECT(SUBJECT, SUBJECT_NAME, PULPIT) values(@subject , @subject_name, @pulpit)');
        });
    }

    postAuditoriumsTypes(auditorium_type, auditorium_typename){
        return this.connectionPool.then(pool => {
            return pool.request()
                .input('auditorium_type', sql.NVarChar, auditorium_type)
                .input('auditorium_typename', sql.NVarChar, auditorium_typename)
                .query('INSERT AUDITORIUM_TYPE(AUDITORIUM_TYPE, AUDITORIUM_TYPENAME) values(@auditorium_type , @auditorium_typename)');
        });
    }

    postAuditoriums(auditorium, auditorium_name, auditorium_capacity, auditorium_type){
        return this.connectionPool.then(pool => {
            return pool.request()
                .input('auditorium', sql.NVarChar, auditorium)
                .input('auditorium_name', sql.NVarChar, auditorium_name)
                .input('auditorium_capacity', sql.Int, auditorium_capacity)
                .input('auditorium_type', sql.NVarChar, auditorium_type)
                .query('INSERT AUDITORIUM(AUDITORIUM, AUDITORIUM_NAME, AUDITORIUM_CAPACITY, AUDITORIUM_TYPE)' +
                             ' values(@auditorium, @auditorium_name, @auditorium_capacity, @auditorium_type)');
        });
    }

    putFaculties(faculty, faculty_name){
        return this.connectionPool.then(pool => {
            return pool.request()
                .input('faculty', sql.NVarChar, faculty)
                .input('faculty_name', sql.NVarChar, faculty_name)
                .query('UPDATE FACULTY SET FACULTY_NAME = @faculty_name WHERE FACULTY = @faculty');
        });
    }

    putPulpits(pulpit, pulpit_name, faculty){
        return this.connectionPool.then(pool => {
            return pool.request()
                .input('pulpit', sql.NVarChar, pulpit)
                .input('pulpit_name', sql.NVarChar, pulpit_name)
                .input('faculty', sql.NVarChar, faculty)
                .query('UPDATE PULPIT SET PULPIT_NAME = @pulpit_name, FACULTY = @faculty WHERE PULPIT = @pulpit');
        });
    }

    putSubjects(subject, subject_name, pulpit){
        return this.connectionPool.then(pool => {

            return pool.request()
                .input('subject', sql.NVarChar, subject)
                .input('subject_name', sql.NVarChar, subject_name)
                .input('pulpit', sql.NVarChar, pulpit)
                .query('UPDATE SUBJECT SET SUBJECT_NAME = @subject_name, PULPIT = @pulpit WHERE SUBJECT = @subject');
        });
    }

    putAuditoriumsTypes(auditorium_type, auditorium_typename){
        return this.connectionPool.then(pool => {
            return pool.request()
                .input('auditorium_type', sql.NVarChar, auditorium_type)
                .input('auditorium_typename', sql.NVarChar, auditorium_typename)
                .query('UPDATE AUDITORIUM_TYPE SET AUDITORIUM_TYPENAME = @auditorium_typename WHERE AUDITORIUM_TYPE = @auditorium_type');
        });
    }

    putAuditoriums(auditorium, auditorium_name, auditorium_capacity, auditorium_type){
        return this.connectionPool.then(pool => {
            return pool.request()
                .input('auditorium', sql.NVarChar, auditorium)
                .input('auditorium_name', sql.NVarChar, auditorium_name)
                .input('auditorium_capacity', sql.Int, auditorium_capacity)
                .input('auditorium_type', sql.NVarChar, auditorium_type)
                .query('UPDATE AUDITORIUM SET AUDITORIUM_NAME = @auditorium_name, AUDITORIUM_CAPACITY = @auditorium_capacity, AUDITORIUM_TYPE =  @auditorium_type' +
                    ' WHERE AUDITORIUM = @auditorium');
        });
    }


    deleteFaculties(faculty){
        return this.connectionPool.then(pool => {
            return pool.request()
                .input('faculty', sql.NVarChar, faculty)
                .query('DELETE FROM FACULTY WHERE FACULTY = @faculty');
        });
    }

    deletePulpits(pulpit){
        return this.connectionPool.then(pool => {
            return pool.request()
                .input('pulpit', sql.NVarChar, pulpit)
                .query('DELETE FROM PULPIT WHERE PULPIT = @pulpit');
        });
    }

    deleteSubjects(subject){
        return this.connectionPool.then(pool => {
            return pool.request()
                .input('subject', sql.NVarChar, subject)
                .query('DELETE FROM SUBJECT WHERE SUBJECT = @subject');
        });
    }

    deleteAuditoriumsTypes(auditorium_type){
        return this.connectionPool.then(pool => {
            return pool.request()
                .input('auditorium_type', sql.NVarChar, auditorium_type)
                .query('DELETE FROM AUDITORIUM_TYPE WHERE AUDITORIUM_TYPE = @auditorium_type');
        });
    }

    deleteAuditoriums(auditorium){
        return this.connectionPool.then(pool => {
            return pool.request()
                .input('auditorium', sql.NVarChar, auditorium)
                .query('DELETE FROM AUDITORIUM WHERE AUDITORIUM = @auditorium');
        });
    }
}
module.exports = DataBaseService;
