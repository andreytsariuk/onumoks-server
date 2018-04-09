const Router = require('express').Router;
const { AdminController } = require('../../../../controllers');
const { Courses } = require('../../../../db/models');


const CoursesRouter = Router();


CoursesRouter.get('/', AdminController.Courses.List);


CoursesRouter.param('course_id', function (req, res, next, course_id) {
    return new Courses({ id: course_id })
        .fetch({ require: true, withRelated: ['specialty'] })
        .then(requestedCourse => req.requestedCourse = requestedCourse)
        .then(() => next())
        .catch(next);
});


CoursesRouter.put('/:course_id', AdminController.Courses.Put);
CoursesRouter.get('/:course_id', AdminController.Courses.Get);




module.exports = { CoursesRouter };