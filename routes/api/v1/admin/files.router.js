const Router = require('express').Router;
const { AdminController } = require('../../../../controllers');
const { Files } = require('../../../../db/models');
const { ValidationMiddleware } = require('../../../../middleware');

const UsersProFilesRouter = require('./users.profile.router');
const FilesRouter = Router();


FilesRouter
    .get(
        '/',
        ValidationMiddleware(AdminController.Files.Schema.List),
        AdminController.Files.List
    )
    .param('file_id', function (req, res, next, file_id) {
        return new Files({ id: file_id })
            .fetch({ require: true, withRelated: ['profile', 'roles'] })
            .then(requestedFile => req.requestedFile = requestedFile)
            .then(() => next())
            .catch(next);
    })
    .put('/:user_id', AdminController.Files.Put)
    .get('/:user_id', AdminController.Files.Get);





module.exports = { FilesRouter };