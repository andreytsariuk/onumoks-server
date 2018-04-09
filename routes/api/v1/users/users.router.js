const Router = require('express').Router;
const _ = require('lodash');
const { UserController } = require('../../../../controllers');
const { Users } = require('../../../../db/models');
// const { ProfileRouter } = require('./Users');
const { AvatarUploadMiddleware } = require('../../../../middleware')

const UserRouter = Router();


UserRouter.get('/', UserController.Main.List);
UserRouter.post('/', UserController.Main.Post);



UserRouter.param('user_id', function (req, res, next, user_id) {
  console.log('FETCH PARAMS')
  return new Users({ id: user_id })
    .fetch({ require: true, withRelated: ['profile', 'roles'] })
    .then(requestedUser => req.requestedUser = requestedUser)
    .then(() => next())
    .catch(next)
});


UserRouter.put('/:user_id', UserController.Main.Put);
//UserRouter.get('/:users', UserController.Get);
UserRouter.get('/:user_id/stats', UserController.Main.Stats);

UserRouter.get('/:user_id', UserController.Main.Get);
UserRouter.post('/:user_id/profile/avatar', AvatarUploadMiddleware, UserController.Profile.UploadAvatar);



// UserRouter.use('/:user/profile', ProfileRouter);

module.exports = UserRouter;
