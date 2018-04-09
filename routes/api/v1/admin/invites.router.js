const Router = require('express').Router;
const _ = require('lodash');
const { AdminController } = require('../../../../controllers');
const { Invites } = require('../../../../db/models');
// const { ProfileRouter } = require('./Invites');

const InvitesRouter = Router();


InvitesRouter.get('/', AdminController.Inviites.list);
InvitesRouter.post('/', AdminController.Inviites.create);


InvitesRouter.param('token', function (req, res, next, token) {
    console.log('FETCH PARAMS')
    return new Invites({ token })
        .fetch({ require: true })
        .then(invite => req.Invite = invite)
        .then(() => next())
        .catch(next)
});


InvitesRouter.get('/:token', AdminController.Inviites.get);

InvitesRouter.param('invite_id', function (req, res, next, invite_id) {
    console.log('FETCH PARAMS')
    return new Invites({ id: invite_id })
        .fetch({ require: true, withRelated: ['profile', 'roles'] })
        .then(invite => req.Invite = invite)
        .then(() => next())
        .catch(next)
});

InvitesRouter.delete('/:invite_id', AdminController.Inviites.delete);


// InvitesRouter.use('/:invite/profile', ProfileRouter);

module.exports = { InvitesRouter };
