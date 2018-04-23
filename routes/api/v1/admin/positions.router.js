const Router = require('express').Router;
const { AdminController } = require('../../../../controllers');
const { Positions } = require('../../../../db/models');


const PositionsRouter = Router();


PositionsRouter.get('/', AdminController.Positions.List);
PositionsRouter.post('/', AdminController.Positions.Post);




PositionsRouter.param('position_id', function (req, res, next, position_id) {
    return new Positions({ id: position_id })
        .fetch({ require: true })
        .then(requestedPosition => req.requestedPosition = requestedPosition)
        .then(() => next())
        .catch(next);
});


PositionsRouter.put('/:position_id', AdminController.Positions.Put);
PositionsRouter.get('/:position_id', AdminController.Positions.Get);




module.exports = { PositionsRouter };