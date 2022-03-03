import DB from './DB.js';

const _db = new DB();

export const resolver = {
    getFaculties: async (args) => {
        if (args.faculty) {
            let result = await _db.getFaculty(args.faculty);
            return result.recordset;
        } else {
            let result = await _db.getAllFaculties();
            return result.recordset;
        }
    },
    getTeachers: async (args) => {
        if (args.teacher) {
            let result = await _db.getTeacher(args.teacher);
            return result.recordset;
        } else {
            let result = await _db.getAllTeachers();
            return result.recordset;
        }
    },
    getPulpits: async (args) => {
        if (args.pulpit) {
            let result = await _db.getPulpit(args.pulpit);
            return result.recordset;
        } else {
            let result = await _db.getAllPulpits();
            return result.recordset;
        }
    },
    getSubjects: async (args) => {
        if (args.subject) {
            let result = await _db.getSubject(args.subject);
            return result.recordset;
        } else {
            let result = await _db.getAllSubjects();
            return result.recordset;
        }
    },
    setFaculty: async (args) => {
        let isFacultyExist = (await _db.getFaculty(args.faculty)).recordset.length !== 0;
        if (isFacultyExist) {
            let result = await _db.updateFaculty(args.faculty, args.faculty_name);
        } else {
            let result = await _db.createFaculty(args.faculty, args.faculty_name);
        }
        let result =  (await _db.getFaculty(args.faculty)).recordset;
        return result.pop();
    },
    setPulpit: async (args) => {
        let isPulpitExist = (await _db.getPulpit(args.pulpit)).recordset.length !== 0;
        if (isPulpitExist) {
            let result = await _db.updatePulpit(args.pulpit, args.pulpit_name, args.faculty);
        } else {
            let result = await _db.createPulpit(args.pulpit, args.pulpit_name, args.faculty);
        }
        let result =  (await _db.getPulpit(args.pulpit)).recordset;
        return result.pop();
    },
    setTeacher: async (args) => {
        let isTeacherExist = (await _db.getTeacher(args.teacher)).recordset.length !== 0;
        if (isTeacherExist) {
            let result = await _db.updateTeacher(args.teacher, args.teacher_name, args.pulpit);
        } else {
            let result = await _db.createTeacher(args.teacher, args.teacher_name, args.pulpit);
        }
        let result =  (await _db.getTeacher(args.teacher)).recordset;
        return result.pop();
    },
    setSubject: async (args) => {
        let isSubjectExist = (await _db.getSubject(args.subject)).recordset.length !== 0;
        if (isSubjectExist) {
            let result = await _db.updateSubject(args.subject, args.subject_name, args.pulpit);
        } else {
            let result = await _db.createSubject(args.subject, args.subject_name, args.pulpit);
        }
        let result =  (await _db.getSubject(args.subject)).recordset;
        return result.pop();
    },
    delFaculty: async (args) => {
        let result = await _db.deleteFaculty(args.faculty);
        return result.rowsAffected.pop() === 1 ? true : false;
    },
    delTeacher: async (args) => {
        let result = await _db.deleteTeacher(args.teacher);
        return result.rowsAffected.pop() === 1 ? true : false;
    },
    delPulpit: async (args) => {
        let result = await _db.deletePulpit(args.pulpit);
        return result.rowsAffected.pop() === 1 ? true : false;
    },
    delSubject: async (args) => {
        let result = await _db.deleteSubject(args.subject);
        return result.rowsAffected.pop() === 1 ? true : false;
    },
    getTeachersByFaculty: async (args) => {
        return (await _db.getAllTeachersByFaculty(args.faculty)).recordset;
    },
    getSubjectsByFaculties: async (args) => {
        let subjects = (await _db.getSubjectsByFaculty(args.faculty)).recordset;
        let pulpits = (await _db.getAllPulpits()).recordset.filter(pulpit => pulpit.FACULTY === args.faculty);
        pulpits.forEach(pulpit => {
            pulpit.subjects = subjects.filter(subject => subject.PULPIT === pulpit.PULPIT);
        });
        console.log(pulpits);
        console.log(pulpits[1].subjects);
        return pulpits;
    }
}