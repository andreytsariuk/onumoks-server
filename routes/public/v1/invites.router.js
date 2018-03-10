const Router = require('express').Router;
const _ = require('lodash');
const { PublicController } = require('../../../controllers');
const { Invites } = require('../../../db/models');

const InvitesRouter = Router();


InvitesRouter.get('/', PublicController.Invites.get);



module.exports = InvitesRouter;
