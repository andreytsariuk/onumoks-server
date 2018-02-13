const Router = require('express').Router;
const _ = require('lodash');
const { CoursesController } = require('../../controllers');
const { Courses } = require('../../models');



let CoursesRouter = Router();
CoursesRouter.param('Course', function (req, res, next, id) {
    return new Courses({ id: id })
        .fetch({ require: true })
        .then(Course => {
           
            req.Course = Course;
            return next();
        })
        .catch(error => {
            if (error instanceof Course.NotFoundError)
                return res.status(404).json({
                    error: 'Course ' + id + ' not found'
                });
            return next(error);
        })
    return next();
});
CoursesRouter.get('/', CoursesController.List);
CoursesRouter.post('/', CoursesController.Post);
CoursesRouter.get('/:Course', CoursesController.Get);
CoursesRouter.put('/:Course', CoursesController.Put);
//CoursesRouter.get('/:users', UserController.Get);



module.exports = CoursesRouter;
