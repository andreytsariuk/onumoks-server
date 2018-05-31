const Router = require('express').Router;
const { AdminController } = require('../../../../controllers');
const { LessonTypes } = require('../../../../db/models');
const { ValidationMiddleware } = require('../../../../middleware');


const LessonTypeRouter = Router();


LessonTypeRouter
    .get(
        '/',
        ValidationMiddleware(AdminController.LessonTypes.Schema.List),
        AdminController.LessonTypes.List
    )
    .post(
        '/',
        ValidationMiddleware(AdminController.LessonTypes.Schema.Create),
        AdminController.LessonTypes.Post
    )
    .param(
        'lesson_type_id',
        function (req, res, next, lesson_type_id) {
            return new LessonTypes({ id: lesson_type_id })
                .fetch({ require: true })
                .then(requestedLessonType => req.requestedLessonType = requestedLessonType)
                .then(() => next())
                .catch(next);
        }
    )
    .put(
        '/:lesson_type_id',
        AdminController.LessonTypes.Put
    )
    .get(
        '/:lesson_type_id',
        AdminController.LessonTypes.Get
    )
    .delete(
        '/:lesson_type_id',
        AdminController.LessonTypes.Delete
    )
    .delete(
        '/multiple-delete',
        AdminController.LessonTypes.MultiDelete
    );






module.exports = { LessonTypeRouter };