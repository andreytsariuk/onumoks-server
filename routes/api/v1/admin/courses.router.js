const Router = require('express').Router;
const { AdminController } = require('../../../../controllers');
const { Courses } = require('../../../../db/models');
const { ValidationMiddleware } = require('../../../../middleware');


const CoursesRouter = Router();


CoursesRouter
    .get('/',
        ValidationMiddleware(AdminController.Courses.Schema.List),
        AdminController.Courses.List
    )
    .post(
        '/',
        ValidationMiddleware(AdminController.Courses.Schema.Create),
        AdminController.Courses.Post
    )
    .param(
        'course_id',
        function (req, res, next, course_id) {
            return new Courses({ id: course_id })
                .fetch({ require: true, withRelated: ['specialty'] })
                .then(requestedCourse => req.requestedCourse = requestedCourse)
                .then(() => next())
                .catch(next);
        }
    )
    .put(
        '/:course_id',
        AdminController.Courses.Put
    )
    .get(
        '/:course_id',
        AdminController.Courses.Get
    );




module.exports = { CoursesRouter };