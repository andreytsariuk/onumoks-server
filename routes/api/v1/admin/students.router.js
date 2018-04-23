const Router = require('express').Router;
const { AdminController } = require('../../../../controllers');
const { RolesTypes } = require('../../../../db/models');


const StudentRouter = Router();


StudentRouter.get('/', AdminController.Students.List);
StudentRouter.post('/new', AdminController.Students.createNew);
StudentRouter.post('/exist', AdminController.Students.createExist);




StudentRouter.param('student_id', function (req, res, next, student_id) {
    return new RolesTypes.Students({ id: student_id })
        .fetch({ require: true, withRelated: ['user', 'user.roles', 'user.profile.avatar'] })
        .then(requestedStudent => req.requestedStudent = requestedStudent)
        .then(() => next())
        .catch(next);
});


StudentRouter.put('/:student_id', AdminController.Students.Put);
StudentRouter.get('/:student_id', AdminController.Students.Get);




module.exports = { StudentRouter };