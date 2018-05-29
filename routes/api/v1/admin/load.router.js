const Router = require('express').Router;
const { AdminController } = require('../../../../controllers');
const { Load } = require('../../../../db/models');
const { ValidationMiddleware } = require('../../../../middleware');
const { LoadItemsRouter } = require('./loadItems.router');

const LoadRouter = Router();


LoadRouter
    .get(
        '/',
        ValidationMiddleware(AdminController.Load.Schema.List),
        AdminController.Load.List
    )
    .post(
        '/',
        ValidationMiddleware(AdminController.Load.Schema.Create),
        AdminController.Load.Post
    )
    .delete(
        '/multiple-delete',
        AdminController.Load.MultiDelete
    )
    .param(
        'load_id',
        function (req, res, next, load_id) {
            return new Load({ id: load_id })
                .fetch({ require: true })
                .then(requestedLoad => req.requestedLoad = requestedLoad)
                .then(() => next())
                .catch(next);
        }
    )
    .put(
        '/:load_id',
        AdminController.Load.Put
    )
    .get(
        '/:load_id',
        AdminController.Load.Get
    )
    .delete(
        '/:load_id',
        AdminController.Load.Delete
    )
    .use(
        '/:load_id/load-items',
        LoadItemsRouter
    );






module.exports = { LoadRouter };