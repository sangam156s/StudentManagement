const studentsRepo = require('../../../lib/studentsRepository'),
      statesRepo = require('../../../lib/statesRepository'),
      util = require('util');

class StudentsController {

    constructor(router) {
        router.get('/', this.getStudents.bind(this));
        router.get('/page/:skip/:top', this.getStudentsPage.bind(this));
        router.get('/:id', this.getStudent.bind(this));
        router.post('/', this.insertStudent.bind(this));
        router.put('/:id', this.updateStudent.bind(this));
        router.delete('/:id', this.deleteStudent.bind(this));
    }

    getStudents(req, res) {
        console.log('*** getStudents');
        studentsRepo.getStudents((err, data) => {
            if (err) {
                console.log('*** getStudents error: ' + util.inspect(err));
                res.json(null);
            } else {
                console.log('*** getStudents ok');
                res.json(data.students);
            }
        });
    }

    getStudentsPage(req, res) {
        console.log('*** getStudentsPage');
        const topVal = req.params.top,
              skipVal = req.params.skip,
              top = (isNaN(topVal)) ? 10 : +topVal,
              skip = (isNaN(skipVal)) ? 0 : +skipVal;

        studentsRepo.getPagedStudents(skip, top, (err, data) => {
            res.setHeader('X-InlineCount', data.count);
            if (err) {
                console.log('*** getStudentsPage error: ' + util.inspect(err));
                res.json(null);
            } else {
                console.log('*** getStudentsPage ok');
                res.json(data.students);
            }
        });
    }

    getStudent(req, res) {
        console.log('*** getStudent');
        const id = req.params.id;
        console.log(id);

        studentsRepo.getStudent(id, (err, student) => {
            if (err) {
                console.log('*** getStudent error: ' + util.inspect(err));
                res.json(null);
            } else {
                console.log('*** getStudent ok');
                res.json(student);
            }
        });
    }

    insertStudent(req, res) {
        console.log('*** insertStudent');
        statesRepo.getState(req.body.stateId, (err, state) => {
            if (err) {
                console.log('*** statesRepo.getState error: ' + util.inspect(err));
                res.json({ status: false, error: 'State not found', student: null });
            } else {
                studentsRepo.insertStudent(req.body, state, (err, student) => {
                    if (err) {
                        console.log('*** studentsRepo.insertStudent error: ' + util.inspect(err));
                        res.json({status: false, error: 'Insert failed', student: null});
                    } else {
                        console.log('*** insertStudent ok');
                        res.json({ status: true, error: null, student: student });
                    }
                });
            }
        });
    }

    updateStudent(req, res) {
        console.log('*** updateStudent');
        console.log('*** req.body');
        console.log(req.body);

        if (!req.body || !req.body.stateId) {
            throw new Error('Student and associated stateId required');
        }

        statesRepo.getState(req.body.stateId, (err, state) => {
            if (err) {
                console.log('*** statesRepo.getState error: ' + util.inspect(err));
                res.json({ status: false, error: 'State not found', student: null });
            } else {
                studentsRepo.updateStudent(req.params.id, req.body, state, (err, student) => {
                    if (err) {
                        console.log('*** updateStudent error: ' + util.inspect(err));
                        res.json({ status: false, error: 'Update failed', student: null });
                    } else {
                        console.log('*** updateStudent ok');
                        res.json({ status: true, error: null, student: student });
                    }
                });
            }
        });
    }

    deleteStudent(req, res) {
        console.log('*** deleteStudent');

        studentsRepo.deleteStudent(req.params.id, (err) => {
            if (err) {
                console.log('*** deleteStudent error: ' + util.inspect(err));
                res.json({ status: false });
            } else {
                console.log('*** deleteStudent ok');
                res.json({ status: true });
            }
        });
    }

}

module.exports = StudentsController;