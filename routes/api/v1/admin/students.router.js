const Router = require('express').Router;
const { AdminController } = require('../../../../controllers');
const { RolesTypes } = require('../../../../db/models');
const { ValidationMiddleware } = require('../../../../middleware');

const StudentRouter = Router();


StudentRouter
    .get(
        '/',
        ValidationMiddleware(AdminController.Students.Schema.List),
        AdminController.Students.List
    )
    .post(
        '/new',
        ValidationMiddleware(AdminController.Students.Schema.createNew),
        AdminController.Students.createNew
    )
    .post(
        '/exist',
        ValidationMiddleware(AdminController.Students.Schema.createExist),
        AdminController.Students.createExist
    )
    .param(
        'student_id',
        function (req, res, next, student_id) {
            return new RolesTypes.Students({ id: student_id })
                .fetch({ require: true, withRelated: ['user', 'user.roles', 'user.profile.avatar'] })
                .then(requestedStudent => req.requestedStudent = requestedStudent)
                .then(() => next())
                .catch(next);
        }
    )
    .put(
        '/:student_id',
        AdminController.Students.Put
    )
    .get(
        '/:student_id',
        ValidationMiddleware(AdminController.Students.Schema.Get),
        AdminController.Students.Get
    );


module.exports = { StudentRouter };