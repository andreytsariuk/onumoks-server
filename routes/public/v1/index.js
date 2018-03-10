const V1Router = require('express').Router();
const InvitesRouter = require('./invites.router')
/**Midddlewears */

/**Paths */

V1Router.use('/invites', InvitesRouter);


module.exports = V1Router;