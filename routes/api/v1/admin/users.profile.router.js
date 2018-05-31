const Router = require('express').Router;
const { AdminController } = require('../../../../controllers');
const { AvatarUploadMiddleware } = require('../../../../middleware');
const { ValidationMiddleware } = require('../../../../middleware');

const UsersProfileRouter = Router();


UsersProfileRouter
    .put(
        '/',
        AdminController.UsersProfiles.update
    )
    .post(
        '/avatar',
        // ValidationMiddleware(AdminController.UsersProfiles.Schema.),
        AvatarUploadMiddleware,
        AdminController.UsersProfiles.UploadAvatar
    );


module.exports = { UsersProfileRouter };


