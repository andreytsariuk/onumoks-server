const Router = require('express').Router;
const { AdminController } = require('../../../../controllers');
const { RolesTypes } = require('../../../../db/models');


const LectorsRouter = Router();


LectorsRouter.get('/', AdminController.Lectors.List);
LectorsRouter.post('/new', AdminController.Lectors.createNew);
LectorsRouter.post('/exist', AdminController.Lectors.createExist);




LectorsRouter.param('lector_id', function (req, res, next, lector_id) {
    return new RolesTypes.Lectors({ id: lector_id })
        .fetch({ require: true })
        .then(requestedLector => req.requestedLector = requestedLector)
        .then(() => next())
        .catch(next);
});


LectorsRouter.put('/:lector_id', AdminController.Lectors.Put);
LectorsRouter.get('/:lector_id', AdminController.Lectors.Get);




module.exports = { LectorsRouter };