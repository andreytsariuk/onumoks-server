const Router = require('express').Router;
const _ = require('lodash');
const { AdminController } = require('../../../../controllers');
const { Invites } = require('../../../../db/models');
// const { ProfileRouter } = require('./Invites');

const InviteRouter = Router();


InviteRouter.get('/', AdminController.Inviites.list);
InviteRouter.post('/', AdminController.Inviites.create);


InviteRouter.param('token', function (req, res, next, token) {
    console.log('FETCH PARAMS')
    return new Invites({ token })
        .fetch({ require: true })
        .then(invite => req.Invite = invite)
        .then(() => next())
        .catch(next)
});


InviteRouter.get('/:token', AdminController.Inviites.get);

InviteRouter.param('invite_id', function (req, res, next, invite_id) {
    console.log('FETCH PARAMS')
    return new Invites({ id: invite_id })
        .fetch({ require: true, withRelated: ['profile', 'roles'] })
        .then(invite => req.Invite = invite)
        .then(() => next())
        .catch(next)
});

InviteRouter.delete('/:invite_id', AdminController.Inviites.delete);


// InviteRouter.use('/:invite/profile', ProfileRouter);

module.exports = InviteRouter;
