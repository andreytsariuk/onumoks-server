const Router = require('express').Router;
const { AdminController } = require('../../../../controllers');
const { Subjects } = require('../../../../db/models');
const { ValidationMiddleware } = require('../../../../middleware');


const SubjectRouter = Router();


SubjectRouter
    .get(
        '/',
        ValidationMiddleware(AdminController.Subjects.Schema.List),
        AdminController.Subjects.List
    )
    .post(
        '/',
        ValidationMiddleware(AdminController.Subjects.Schema.Create),
        AdminController.Subjects.Post
    )
    .param(
        'subject_id',
        function (req, res, next, subject_id) {
            return new Subjects({ id: subject_id })
                .fetch({ require: true })
                .then(requestedSubject => req.requestedSubject = requestedSubject)
                .then(() => next())
                .catch(next);
        }
    )
    .put(
        '/:subject_id',
        AdminController.Subjects.Put
    )
    .get(
        '/:subject_id',
        AdminController.Subjects.Get
    )
    .delete(
        '/:subject_id',
        AdminController.Subjects.Delete
    )
    .delete(
        '/multiple-delete',
        AdminController.Subjects.MultiDelete
    );






module.exports = { SubjectRouter };