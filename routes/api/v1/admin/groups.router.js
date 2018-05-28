const Router = require('express').Router;
const { AdminController } = require('../../../../controllers');
const { Groups } = require('../../../../db/models');


const GroupRouter = Router();


GroupRouter.get('/', AdminController.Groups.List);
GroupRouter.post('/', AdminController.Groups.Post);


GroupRouter.param('group_id', function (req, res, next, group_id) {
    return new Groups({ id: group_id })
        .fetch({ require: true })
        .then(requestedGroup => req.requestedGroup = requestedGroup)
        .then(() => next())
        .catch(next);
});

GroupRouter.put('/:group_id', AdminController.Groups.Put);
GroupRouter.get('/:group_id', AdminController.Groups.Get);
GroupRouter.delete('/:group_id', AdminController.Groups.Delete);
GroupRouter.delete('/multiple-delete', AdminController.Groups.MultiDelete);






module.exports = { GroupRouter };