const Router = require('express').Router;
const { AdminController } = require('../../../../controllers');
const { Specialties } = require('../../../../db/models');


const SpecialtyRouter = Router();


SpecialtyRouter.get('/', AdminController.Specialties.List);


SpecialtyRouter.param('specialty_id', function (req, res, next, specialty_id) {
    return new Specialties({ id: specialty_id })
        .fetch({ require: true })
        .then(requestedSpecialty => req.requestedSpecialty = requestedSpecialty)
        .then(() => next())
        .catch(next);
});


SpecialtyRouter.put('/:specialty_id', AdminController.Specialties.Put);
SpecialtyRouter.get('/:specialty_id', AdminController.Specialties.Get);




module.exports = { SpecialtyRouter };