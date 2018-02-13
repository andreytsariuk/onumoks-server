const Router = require('express').Router;
const _ = require('lodash');
const { UserProfileController } = require('../../../controllers');
const { AvatarUploadMiddleware } = require('../../../middleware');



let ProfileRouter = Router();

ProfileRouter.put('/', UserProfileController.Put);





ProfileRouter.get('/avatar', UserProfileController.Avatar);
ProfileRouter.post('/avatar', AvatarUploadMiddleware, UserProfileController.UploadAvatar);




module.exports = ProfileRouter;
