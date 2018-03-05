
const InvitesRouter = require('./invites.router')
const AdminRouter = require('express').Router();


/**Paths */

AdminRouter.use('/invites', InvitesRouter);




module.exports = AdminRouter;
