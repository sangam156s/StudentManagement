const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      Student = require('../models/student');

class StudentsRepository {

    // get all the students
    getStudents(callback) {
        console.log('*** StudentsRepository.getStudents');
        Student.count((err, custsCount) => {
            let count = custsCount;
            console.log(`Students count: ${count}`);

            Student.find({}, (err, students) => {
                if (err) { 
                    console.log(`*** StudentsRepository.getStudents error: ${err}`); 
                    return callback(err); 
                }
                callback(null, {
                    count: count,
                    students: students
                });
            });

        });
    }

    getPagedStudents(skip, top, callback) {
        console.log('*** StudentsRepository.getPagedStudents');
        Student.count((err, custsCount) => {
            let count = custsCount;
            console.log(`Skip: ${skip} Top: ${top}`);
            console.log(`Students count: ${count}`);

            Student.find({})
                    .sort({lastName: 1})
                    .skip(skip)
                    .limit(top)
                    .exec((err, students) => {
                        if (err) { 
                            console.log(`*** StudentsRepository.getPagedStudents error: ${err}`); 
                            return callback(err); 
                        }
                        callback(null, {
                            count: count,
                            students: students
                        });
                    });

        });
    }

    // get the student summary
    getStudentsSummary(skip, top, callback) {
        console.log('*** StudentsRepository.getStudentsSummary');
        Student.count((err, custsCount) => {
            let count = custsCount;
            console.log(`Students count: ${count}`);

            Student.find({}, { '_id': 0, 'firstName': 1, 'lastName': 1, 'city': 1, 'state': 1, 'orderCount': 1, 'gender': 1 })
                    .skip(skip)
                    .limit(top)
                    .exec((err, studentsSummary) => {
                        callback(null, {
                            count: count,
                            studentsSummary: studentsSummary
                        });
                    });

        });
    }

    // get a  student
    getStudent(id, callback) {
        console.log('*** StudentsRepository.getStudent');
        Student.findById(id, (err, student) => {
            if (err) { 
                console.log(`*** StudentsRepository.getStudent error: ${err}`); 
                return callback(err); 
            }
            callback(null, student);
        });
    }

    // insert a  student
    insertStudent(body, state, callback) {
        console.log('*** StudentsRepository.insertStudent');
        console.log(state);
        let student = new Student();
        let newState = { 'id': state[0].id, 'abbreviation': state[0].abbreviation, 'name': state[0].name }
        console.log(body);

        student.firstName = body.firstName;
        student.lastName = body.lastName;
        student.email = body.email;
        student.address = body.address;
        student.city = body.city;
        student.state = newState;
        student.stateId = newState.id;
        student.zip = body.zip;
        student.gender = body.gender;

        student.save((err, student) => {
            if (err) { 
                console.log(`*** StudentsRepository insertStudent error: ${err}`); 
                return callback(err, null); 
            }

            callback(null, student);
        });
    }

    updateStudent(id, body, state, callback) {
        console.log('*** StudentsRepository.editStudent');

        let stateObj = { 'id': state[0].id, 'abbreviation': state[0].abbreviation, 'name': state[0].name }

        Student.findById(id, (err, student)  => {
            if (err) { 
                console.log(`*** StudentsRepository.editStudent error: ${err}`); 
                return callback(err); 
            }

            student.firstName = body.firstName || student.firstName;
            student.lastName = body.lastName || student.lastName;
            student.email = body.email || student.email;
            student.address = body.address || student.address;
            student.city = body.city || student.city;
            student.state = stateObj;
            student.stateId = stateObj.id;
            student.zip = body.zip || student.zip;
            student.gender = body.gender || student.gender;


            student.save((err, student) => {
                if (err) { 
                    console.log(`*** StudentsRepository.updateStudent error: ${err}`); 
                    return callback(err, null); 
                }

                callback(null, student);
            });

        });
    }

    // delete a student
    deleteStudent(id, callback) {
        console.log('*** StudentsRepository.deleteStudent');
        Student.remove({ '_id': id }, (err, student) => {
            if (err) { 
                console.log(`*** StudentsRepository.deleteStudent error: ${err}`); 
                return callback(err, null); 
            }
            callback(null, student);
        });
    }

}

module.exports = new StudentsRepository();