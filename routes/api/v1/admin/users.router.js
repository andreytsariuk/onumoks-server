const Router = require('express').Router;
const { AdminController } = require('../../../../controllers');
const { Users } = require('../../../../db/models');
const { UsersProfileRouter } = require('./users.profile.router');


const UsersRouter = Router();


UsersRouter.get('/', AdminController.Users.List);


UsersRouter.param('user_id', function (req, res, next, user_id) {
    return new Users({ id: user_id })
        .fetch({ require: true, withRelated: ['profile', 'roles'] })
        .then(requestedUser => req.requestedUser = requestedUser)
        .then(() => next())
        .catch(next);
});


UsersRouter.put('/:user_id', AdminController.Users.Put);
UsersRouter.get('/:user_id', AdminController.Users.Get);



//---------------------Profile Routes------------------
UsersRouter.use('/:user_id/profile', UsersProfileRouter);


module.exports = { UsersRouter };