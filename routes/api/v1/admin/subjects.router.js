const Router = require('express').Router;
const { AdminController } = require('../../../../controllers');
const { Subjects } = require('../../../../db/models');


const SubjectRouter = Router();


SubjectRouter.get('/', AdminController.Subjects.List);
SubjectRouter.post('/', AdminController.Subjects.Post);


SubjectRouter.param('subject_id', function (req, res, next, subject_id) {
    return new Subjects({ id: subject_id })
        .fetch({ require: true })
        .then(requestedSubject => req.requestedSubject = requestedSubject)
        .then(() => next())
        .catch(next);
});

SubjectRouter.put('/:subject_id', AdminController.Subjects.Put);
SubjectRouter.get('/:subject_id', AdminController.Subjects.Get);
SubjectRouter.delete('/:subject_id', AdminController.Subjects.Delete);
SubjectRouter.delete('/multiple-delete', AdminController.Subjects.MultiDelete);






module.exports = { SubjectRouter };