const Router = require('express').Router;
const { AdminController } = require('../../../../controllers');
const { LoadItems } = require('../../../../db/models');
const { ValidationMiddleware } = require('../../../../middleware');


const LoadItemsRouter = Router();


LoadItemsRouter
    .get(
        '/',
        ValidationMiddleware(AdminController.LoadItems.Schema.List),
        AdminController.LoadItems.List
    )
    .post(
        '/',
        ValidationMiddleware(AdminController.LoadItems.Schema.Create),
        AdminController.LoadItems.Post
    )
    .param(
        'load_id',
        function (req, res, next, load_id) {
            return new LoadItems({ id: load_id })
                .fetch({ require: true })
                .then(requestedLoadItems => req.requestedLoadItems = requestedLoadItems)
                .then(() => next())
                .catch(next);
        }
    )
    .put(
        '/:load_id',
        AdminController.LoadItems.Put
    )
    .get(
        '/:load_id',
        AdminController.LoadItems.Get
    )




module.exports = { LoadItemsRouter };