const Router = require('express').Router;
const { AdminController } = require('../../../../controllers');
const { Positions } = require('../../../../db/models');
const { ValidationMiddleware } = require('../../../../middleware');


const PositionsRouter = Router();


PositionsRouter
    .get(
        '/',
        ValidationMiddleware(AdminController.Positions.Schema.List),
        AdminController.Positions.List
    )
    .post(
        '/',
        ValidationMiddleware(AdminController.Positions.Schema.Create),
        AdminController.Positions.Post
    )
    .param(
        'position_id',
        function (req, res, next, position_id) {
            return new Positions({ id: position_id })
                .fetch({ require: true })
                .then(requestedPosition => req.requestedPosition = requestedPosition)
                .then(() => next())
                .catch(next);
        }
    )
    .put(
        '/:position_id',
        AdminController.Positions.Put
    )
    .get(
        '/:position_id',
        AdminController.Positions.Get
    );




module.exports = { PositionsRouter };