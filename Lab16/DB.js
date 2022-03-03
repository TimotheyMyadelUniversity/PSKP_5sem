import sql from 'mssql';

const config = {
    user: 'PyrogLogin',
    password: 'Pyrog123',
    server: 'PYROG',
    database: 'IMS',
    port: 1433,
    trustServerCertificate: true,
};

export default class DB {
    constructor() {
        this.connectionPool = new sql.ConnectionPool(config)
            .connect()
            .then(pool => {
                console.log('Соединение с БД установлено');
                return pool;
            })
            .catch(error => {
                console.log('Ошибка соединения с БД: ', error);
            });
    }

    getAllFaculties() {
        return this.connectionPool.then(pool => pool.request().query('SELECT * FROM FACULTY'));
    }

    getAllTeachers() {
        return this.connectionPool.then(pool => pool.request().query('SELECT * FROM TEACHER'));
    }

    getAllTeachersByFaculty(faculty) {
        return this.connectionPool.then(pool => {
            return pool.request()
                .input('faculty', sql.NVarChar, faculty)
                .query('select distinct TEACHER.TEACHER, TEACHER.TEACHER_NAME, TEACHER.PULPIT \n' +
                    'from TEACHER\n' +
                    'join PULPIT on PULPIT.PULPIT = TEACHER.PULPIT\n' +
                    'where PULPIT.FACULTY = @faculty');
        });
    }

    getSubjectsByFaculty(faculty) {
        return this.connectionPool.then(pool => {
            return pool.request()
                .input('faculty', sql.NVarChar, faculty)
                .query('select distinct SUBJECT.SUBJECT, SUBJECT.SUBJECT_NAME, SUBJECT.PULPIT\n' +
                    'from SUBJECT\n' +
                    'join PULPIT on PULPIT.PULPIT = SUBJECT.PULPIT\n' +
                    'where PULPIT.FACULTY = @faculty');
        });
    }

    getAllPulpits() {
        return this.connectionPool.then(pool => pool.request().query('SELECT * FROM PULPIT'))
    }

    getAllSubjects() {
        return this.connectionPool.then(pool => pool.request().query('SELECT * FROM SUBJECT'))
    }

    getAllAuditoriumsTypes() {
        return this.connectionPool.then(pool => pool.request().query('SELECT * FROM AUDITORIUM_TYPE'))
    }

    getAllAuditoriums() {
        return this.connectionPool.then(pool => pool.request().query('SELECT * FROM AUDITORIUM'))
    }

    getFaculty(faculty) {
        return this.connectionPool.then(pool => {
            return pool.request()
                .input('faculty', sql.NVarChar, faculty)
                .query('SELECT * FROM FACULTY WHERE FACULTY = @faculty');
        });
    }

    getTeacher(teacher) {
        return this.connectionPool.then(pool => {
            return pool.request()
                .input('teacher', sql.NVarChar, teacher)
                .query('SELECT * FROM TEACHER WHERE TEACHER = @teacher');
        });
    }

    getPulpit(pulpit) {
        return this.connectionPool.then(pool => {
            return pool.request()
                .input('pulpit', sql.NVarChar, pulpit)
                .query('SELECT * FROM PULPIT WHERE PULPIT = @pulpit');
        });
    }

    getSubject(subject) {
        return this.connectionPool.then(pool => {
            return pool.request()
                .input('subject', sql.NVarChar, subject)
                .query('SELECT * FROM SUBJECT WHERE SUBJECT = @subject');
        });
    }

    getAuditoriumType(auditorium_type) {
        return this.connectionPool.then(pool => {
            return pool.request()
                .input('auditorium_type', sql.NVarChar, auditorium_type)
                .query('SELECT * FROM AUDITORIUM_TYPE WHERE AUDITORIUM_TYPE = @auditorium_type');
        });
    }

    getAuditorium(auditorium) {
        return this.connectionPool.then(pool => {
            return pool.request()
                .input('auditorium', sql.NVarChar, auditorium)
                .query('SELECT * FROM AUDITORIUM WHERE AUDITORIUM = @auditorium');
        });
    }

    createFaculty(faculty, faculty_name) {
        return this.connectionPool.then(pool => {
            return pool.request()
                .input('faculty', sql.NVarChar, faculty)
                .input('faculty_name', sql.NVarChar, faculty_name)
                .query('INSERT FACULTY(FACULTY, FACULTY_NAME) VALUES(@faculty, @faculty_name)');
        });
    }

    createPulpit(pulpit, pulpit_name, faculty) {
        return this.connectionPool.then(pool => {
            return pool.request()
                .input('pulpit', sql.NVarChar, pulpit)
                .input('pulpit_name', sql.NVarChar, pulpit_name)
                .input('faculty', sql.NVarChar, faculty)
                .query('INSERT PULPIT(PULPIT, PULPIT_NAME, FACULTY) VALUES(@pulpit , @pulpit_name, @faculty)');
        });
    }

    createSubject(subject, subject_name, pulpit) {
        return this.connectionPool.then(pool => {
            return pool.request()
                .input('subject', sql.NVarChar, subject)
                .input('subject_name', sql.NVarChar, subject_name)
                .input('pulpit', sql.NVarChar, pulpit)
                .query('INSERT SUBJECT(SUBJECT, SUBJECT_NAME, PULPIT) VALUES(@subject , @subject_name, @pulpit)');
        });
    }

    createTeacher(teacher, teacher_name, pulpit) {
        return this.connectionPool.then(pool => {
            return pool.request()
                .input('teacher', sql.NVarChar, teacher)
                .input('teacher_name', sql.NVarChar, teacher_name)
                .input('pulpit', sql.NVarChar, pulpit)
                .query('INSERT TEACHER(TEACHER, TEACHER_NAME, PULPIT) VALUES(@teacher , @teacher_name, @pulpit)');
        });
    }

    createAuditoriumType(auditorium_type, auditorium_typename) {
        return this.connectionPool.then(pool => {
            return pool.request()
                .input('auditorium_type', sql.NVarChar, auditorium_type)
                .input('auditorium_typename', sql.NVarChar, auditorium_typename)
                .query('INSERT AUDITORIUM_TYPE(AUDITORIUM_TYPE, AUDITORIUM_TYPENAME) VALUES(@auditorium_type , @auditorium_typename)');
        });
    }

    createAuditorium(auditorium, auditorium_name, auditorium_capacity, auditorium_type) {
        return this.connectionPool.then(pool => {
            return pool.request()
                .input('auditorium', sql.NVarChar, auditorium)
                .input('auditorium_name', sql.NVarChar, auditorium_name)
                .input('auditorium_capacity', sql.Int, auditorium_capacity)
                .input('auditorium_type', sql.NVarChar, auditorium_type)
                .query('INSERT AUDITORIUM(AUDITORIUM, AUDITORIUM_NAME, AUDITORIUM_CAPACITY, AUDITORIUM_TYPE)' +
                       ' VALUES(@auditorium, @auditorium_name, @auditorium_capacity, @auditorium_type)');
        });
    }

    deleteFaculty(faculty) {
        return this.connectionPool.then(pool => {
            return pool.request()
                .input('faculty', sql.NVarChar, faculty)
                .query('DELETE FACULTY WHERE FACULTY = @faculty');
        });
    }

    deletePulpit(pulpit) {
        return this.connectionPool.then(pool => {
            return pool.request()
                .input('pulpit', sql.NVarChar, pulpit)
                .query('DELETE PULPIT WHERE PULPIT = @pulpit');
        });
    }

    deleteSubject(subject) {
        return this.connectionPool.then(pool => {
            return pool.request()
                .input('subject', sql.NVarChar, subject)
                .query('DELETE SUBJECT WHERE SUBJECT = @subject');
        });
    }

    deleteTeacher(teacher) {
        return this.connectionPool.then(pool => {
            return pool.request()
                .input('teacher', sql.NVarChar, teacher)
                .query('DELETE TEACHER WHERE TEACHER = @teacher');
        });
    }

    deleteAuditoriumType(auditorium_type){
        return this.connectionPool.then(pool => {
            return pool.request()
                .input('auditorium_type', sql.NVarChar, auditorium_type)
                .query('DELETE AUDITORIUM_TYPE WHERE AUDITORIUM_TYPE = @auditorium_type');
        });
    }

    deleteAuditorium(auditorium){
        return this.connectionPool.then(pool => {
            return pool.request()
                .input('auditorium', sql.NVarChar, auditorium)
                .query('DELETE AUDITORIUM WHERE AUDITORIUM = @auditorium');
        });
    }

    updateFaculty(faculty, faculty_name){
        return this.connectionPool.then(pool => {
            return pool.request()
                .input('faculty', sql.NVarChar, faculty)
                .input('faculty_name', sql.NVarChar, faculty_name)
                .query('UPDATE FACULTY SET FACULTY_NAME = @faculty_name WHERE FACULTY = @faculty');
        });
    }

    updatePulpit(pulpit, pulpit_name, faculty){
        return this.connectionPool.then(pool => {
            return pool.request()
                .input('pulpit', sql.NVarChar, pulpit)
                .input('pulpit_name', sql.NVarChar, pulpit_name)
                .input('faculty', sql.NVarChar, faculty)
                .query('UPDATE PULPIT SET PULPIT_NAME = @pulpit_name, FACULTY = @faculty WHERE PULPIT = @pulpit');
        });
    }

    updateSubject(subject, subject_name, pulpit){
        return this.connectionPool.then(pool => {
            return pool.request()
                .input('subject', sql.NVarChar, subject)
                .input('subject_name', sql.NVarChar, subject_name)
                .input('pulpit', sql.NVarChar, pulpit)
                .query('UPDATE SUBJECT SET SUBJECT_NAME = @subject_name, PULPIT = @pulpit WHERE SUBJECT = @subject');
        });
    }

    updateTeacher(teacher, teacher_name, pulpit){
        return this.connectionPool.then(pool => {
            return pool.request()
                .input('teacher', sql.NVarChar, teacher)
                .input('teacher_name', sql.NVarChar, teacher_name)
                .input('pulpit', sql.NVarChar, pulpit)
                .query('UPDATE TEACHER SET TEACHER_NAME = @teacher_name, PULPIT = @pulpit WHERE TEACHER = @teacher');
        });
    }

    updateAuditoriumType(auditorium_type, auditorium_typename){
        return this.connectionPool.then(pool => {
            return pool.request()
                .input('auditorium_type', sql.NVarChar, auditorium_type)
                .input('auditorium_typename', sql.NVarChar, auditorium_typename)
                .query('UPDATE AUDITORIUM_TYPE SET AUDITORIUM_TYPENAME = @auditorium_typename WHERE AUDITORIUM_TYPE = @auditorium_type');
        });
    }

    updateAuditorium(auditorium, auditorium_name, auditorium_capacity, auditorium_type){
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
}