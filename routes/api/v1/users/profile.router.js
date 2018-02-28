const Router = require('express').Router;
const _ = require('lodash');
const { UserController } = require('../../../../controllers');
const { AvatarUploadMiddleware } = require('../../../../middleware');



let ProfileRouter = Router();

ProfileRouter.put('/', UserController.Profile.Put);





ProfileRouter.get('/avatar', UserController.Profile.Avatar);
ProfileRouter.post('/avatar', AvatarUploadMiddleware, UserController.Profile.UploadAvatar);




module.exports = ProfileRouter;
