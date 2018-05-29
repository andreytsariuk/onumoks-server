const Router = require('express').Router;
const { AdminController } = require('../../../../controllers');
const { Groups } = require('../../../../db/models');
const { ValidationMiddleware } = require('../../../../middleware');


const GroupRouter = Router();


GroupRouter
    .get(
        '/',
        ValidationMiddleware(AdminController.Groups.Schema.List),
        AdminController.Groups.List
    )
    .post(
        '/',
        ValidationMiddleware(AdminController.Groups.Schema.Create),
        AdminController.Groups.Post
    )
    .delete(
        '/multiple-delete',
        AdminController.Groups.MultiDelete
    )
    .param(
        'group_id',
        function (req, res, next, group_id) {
            return new Groups({ id: group_id })
                .fetch({ require: true })
                .then(requestedGroup => req.requestedGroup = requestedGroup)
                .then(() => next())
                .catch(next);
        }
    )
    .put(
        '/:group_id',
        AdminController.Groups.Put
    )
    .get(
        '/:group_id',
        AdminController.Groups.Get
    )
    .delete(
        '/:group_id',
        AdminController.Groups.Delete
    );






module.exports = { GroupRouter };