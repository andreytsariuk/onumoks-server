const Router = require('express').Router;
const { AdminController } = require('../../../../controllers');
const { Files } = require('../../../../db/models');
const { ValidationMiddleware, FileMiddleware } = require('../../../../middleware');

const UsersProFilesRouter = require('./users.profile.router');
const FilesRouter = Router();


FilesRouter
    .get(
        '/',
        ValidationMiddleware(AdminController.Files.Schema.List),
        AdminController.Files.List
    )
    .param('file_type', function (req, res, next, file_type) {
        console.log('fooo')
        req.file_type = file_type;
        return next();
    })
    .post(
        '/:file_type',
        FileMiddleware,
        //ValidationMiddleware(AdminController.Files.Schema.Create),
        AdminController.Files.Create
    )
    .param('file_id', function (req, res, next, file_id) {
        return new Files({ id: file_id })
            .fetch({ require: true, withRelated: ['file'] })
            .then(requestedFile => req.requestedFile = requestedFile)
            .then(() => next())
            .catch(next);
    })
    .put('/:file_id', AdminController.Files.Put)
    .get('/:file_id', AdminController.Files.Get)
    .delete('/:file_id', AdminController.Files.Delete);





module.exports = { FilesRouter };