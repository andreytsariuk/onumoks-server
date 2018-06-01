const Router = require('express').Router;
const { AdminController } = require('../../../../controllers');
const { RolesTypes } = require('../../../../db/models');
const { ValidationMiddleware } = require('../../../../middleware');
const { FilesRouter } = require('./files.router');

const LectorsRouter = Router();


LectorsRouter
    .get(
        '/',
        ValidationMiddleware(AdminController.Lectors.Schema.List),
        AdminController.Lectors.List
    )
    .post(
        '/new',
        ValidationMiddleware(AdminController.Lectors.Schema.createNew),
        AdminController.Lectors.createNew
    )
    .post(
        '/exist',
        ValidationMiddleware(AdminController.Lectors.Schema.createExist),
        AdminController.Lectors.createExist
    )
    .param(
        'lector_id',
        function (req, res, next, lector_id) {
            return new RolesTypes.Lectors({ id: lector_id })
                .fetch({ require: true })
                .then(requestedLector => req.requestedLector = requestedLector)
                .then(() => next())
                .catch(next);
        }
    )
    .put(
        '/:lector_id',
        AdminController.Lectors.Put
    )
    .get(
        '/:lector_id',
        AdminController.Lectors.Get
    )
    .use(
        '/:lector_id/files',
        FilesRouter
    );




module.exports = { LectorsRouter };