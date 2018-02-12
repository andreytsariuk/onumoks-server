const Router = require('express').Router;
const _ = require('lodash');
const { SpecialtiesController } = require('../../controllers');
const { Specialties } = require('../../models');



let SpecialtiesRouter = Router();
SpecialtiesRouter.param('specialty', function (req, res, next, id) {
    return new Specialties({ id: id })
        .fetch({ require: true })
        .then(specialty => {
           
            req.Specialty = specialty;
            return next();
        })
        .catch(error => {
            if (error instanceof Specialty.NotFoundError)
                return res.status(404).json({
                    error: 'Specialty ' + id + ' not found'
                });
            return next(error);
        })
    return next();
});
SpecialtiesRouter.get('/', SpecialtiesController.List);
SpecialtiesRouter.post('/', SpecialtiesController.Post);
SpecialtiesRouter.get('/:specialty', SpecialtiesController.Get);
SpecialtiesRouter.put('/:specialty', SpecialtiesController.Put);
//SpecialtiesRouter.get('/:users', UserController.Get);



module.exports = SpecialtiesRouter;
