const Router = require('express').Router;
const { AdminController } = require('../../../../controllers');
const { Threads } = require('../../../../db/models');


const ThreadRouter = Router();


ThreadRouter.get('/', AdminController.Threads.List);
ThreadRouter.post('/', AdminController.Threads.Post);


ThreadRouter.param('thread_id', function (req, res, next, thread_id) {
    return new Threads({ id: thread_id })
        .fetch({ require: true })
        .then(requestedThread => req.requestedThread = requestedThread)
        .then(() => next())
        .catch(next);
});

ThreadRouter.put('/:thread_id', AdminController.Threads.Put);
ThreadRouter.get('/:thread_id', AdminController.Threads.Get);
ThreadRouter.delete('/:thread_id', AdminController.Threads.Delete);
ThreadRouter.delete('/multiple-delete', AdminController.Threads.MultiDelete);






module.exports = { ThreadRouter };