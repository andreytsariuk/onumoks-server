const Router = require('express').Router;
const { AdminController } = require('../../../../controllers');
const { AvatarUploadMiddleware } = require('../../../../middleware')
const UsersProfileRouter = Router();


UsersProfileRouter.put('/', AdminController.UsersProfiles.update);

UsersProfileRouter.post('/avatar', AvatarUploadMiddleware, AdminController.UsersProfiles.UploadAvatar);


module.exports = { UsersProfileRouter };


