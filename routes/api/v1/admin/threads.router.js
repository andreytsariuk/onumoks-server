const Router = require('express').Router;
const { AdminController } = require('../../../../controllers');
const { Threads } = require('../../../../db/models');
const { ValidationMiddleware } = require('../../../../middleware');


const ThreadRouter = Router();


ThreadRouter
    .get(
        '/',
        ValidationMiddleware(AdminController.Threads.Schema.List),
        AdminController.Threads.List
    )
    .post(
        '/',
        ValidationMiddleware(AdminController.Threads.Schema.Create),
        AdminController.Threads.Post
    )
    .delete(
        '/multiple-delete',
        AdminController.Threads.MultiDelete
    )
    .param(
        'thread_id',
        function (req, res, next, thread_id) {
            return new Threads({ id: thread_id })
                .fetch({ require: true })
                .then(requestedThread => req.requestedThread = requestedThread)
                .then(() => next())
                .catch(next);
        }
    )
    .put(
        '/:thread_id',
        AdminController.Threads.Put
    )
    .get(
        '/:thread_id',
        AdminController.Threads.Get
    )
    .delete(
        '/:thread_id',
        AdminController.Threads.Delete
    );






module.exports = { ThreadRouter };