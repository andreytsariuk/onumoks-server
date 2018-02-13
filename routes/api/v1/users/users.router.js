const Router = require('express').Router;
const _ = require('lodash');
const { UserController } = require('../../controllers');
const { User } = require('../../models');
const { ProfileRouter } = require('./Users');


let UserRouter = Router();
UserRouter.param('user', function (req, res, next, id) {
  return new User({ id: id })
    .fetch({ require: true, withRelated: ['profile'] })
    .then(user => {
      req.User = user;
      return next();
    })
    .catch(error => {
      if (error instanceof User.NotFoundError)
        return res.status(404).json({
          error: 'User ' + id + ' not found'
        });
      return next(error);
    })
});

UserRouter.get('/', UserController.List);
UserRouter.post('/', UserController.Post);
UserRouter.put('/:users', UserController.Put);
//UserRouter.get('/:users', UserController.Get);
UserRouter.get('/:users/stats', UserController.Stats);

UserRouter.get('/:user', UserController.Get);


UserRouter.use('/:user/profile', ProfileRouter);

module.exports = UserRouter;
