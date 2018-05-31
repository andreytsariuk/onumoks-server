const Router = require('express').Router;
const _ = require('lodash');
const { AdminController } = require('../../../../controllers');
const { Invites } = require('../../../../db/models');
const { ValidationMiddleware } = require('../../../../middleware');


const InvitesRouter = Router();


InvitesRouter
    .get(
        '/',
        ValidationMiddleware(AdminController.Inviites.Schema.List),
        AdminController.Inviites.List
    )
    .post(
        '/',
        ValidationMiddleware(AdminController.Inviites.Schema.Create),
        AdminController.Inviites.create
    )
    .param(
        'token',
        function (req, res, next, token) {
            return new Invites({ token })
                .fetch({ require: true })
                .then(invite => req.Invite = invite)
                .then(() => next())
                .catch(next)
        }
    )
    .get(
        '/:token',
        AdminController.Inviites.get
    )
    .param(
        'invite_id',
        function (req, res, next, invite_id) {
            return new Invites({ id: invite_id })
                .fetch({ require: true, withRelated: ['profile', 'roles'] })
                .then(invite => req.Invite = invite)
                .then(() => next())
                .catch(next)
        }
    )
    .delete(
        '/:invite_id',
        AdminController.Inviites.delete
    );


module.exports = { InvitesRouter };
