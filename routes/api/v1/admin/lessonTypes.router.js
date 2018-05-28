const Router = require('express').Router;
const { AdminController } = require('../../../../controllers');
const { LessonTypes } = require('../../../../db/models');


const LessonTypeRouter = Router();


LessonTypeRouter.get('/', AdminController.LessonTypes.List);
LessonTypeRouter.post('/', AdminController.LessonTypes.Post);


LessonTypeRouter.param('lesson_type_id', function (req, res, next, lesson_type_id) {
    return new LessonTypes({ id: lesson_type_id })
        .fetch({ require: true })
        .then(requestedLessonType => req.requestedLessonType = requestedLessonType)
        .then(() => next())
        .catch(next);
});

LessonTypeRouter.put('/:lesson_type_id', AdminController.LessonTypes.Put);
LessonTypeRouter.get('/:lesson_type_id', AdminController.LessonTypes.Get);
LessonTypeRouter.delete('/:lesson_type_id', AdminController.LessonTypes.Delete);
LessonTypeRouter.delete('/multiple-delete', AdminController.LessonTypes.MultiDelete);






module.exports = { LessonTypeRouter };