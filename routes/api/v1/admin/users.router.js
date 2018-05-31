const Router = require('express').Router;
const { AdminController } = require('../../../../controllers');
const { Users } = require('../../../../db/models');
const { UsersProfileRouter } = require('./users.profile.router');
const { ValidationMiddleware } = require('../../../../middleware');


const UsersRouter = Router();


UsersRouter
    .get(
        '/',
        ValidationMiddleware(AdminController.Users.Schema.List),
        AdminController.Users.List
    )
    .param(
        'user_id',
        function (req, res, next, user_id) {
            return new Users({ id: user_id })
                .fetch({ require: true, withRelated: ['profile', 'roles'] })
                .then(requestedUser => req.requestedUser = requestedUser)
                .then(() => next())
                .catch(next);
        }
    )
    .put(
        '/:user_id',
        AdminController.Users.Put
    )
    .get(
        '/:user_id',
        AdminController.Users.Get
    )

    //---------------------Profile Routes------------------
    .use(
        '/:user_id/profile',
        UsersProfileRouter
    );


module.exports = { UsersRouter };