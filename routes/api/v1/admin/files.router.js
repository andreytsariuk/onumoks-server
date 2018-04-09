const Router = require('express').Router;
const { AdminController } = require('../../../../controllers');
const { Files } = require('../../../../db/models');

const UsersProFilesRouter = require('./users.profile.router');
const FilesRouter = Router();


FilesRouter.get('/', AdminController.Files.List);


FilesRouter.param('file_id', function (req, res, next, file_id) {
    return new Files({ id: file_id })
        .fetch({ require: true, withRelated: ['profile', 'roles'] })
        .then(requestedFile => req.requestedFile = requestedFile)
        .then(() => next())
        .catch(next);
});


FilesRouter.put('/:user_id', AdminController.Files.Put);
FilesRouter.get('/:user_id', AdminController.Files.Get);





module.exports = { FilesRouter };