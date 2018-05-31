const Router = require('express').Router;
const { AdminController } = require('../../../../controllers');
const { Specialties } = require('../../../../db/models');
const { ValidationMiddleware } = require('../../../../middleware');


const SpecialtyRouter = Router();


SpecialtyRouter
    .get(
        '/',
        ValidationMiddleware(AdminController.Specialties.Schema.List),
        AdminController.Specialties.List
    )
    .post(
        '/',
        ValidationMiddleware(AdminController.Specialties.Schema.Create),
        AdminController.Specialties.Post
    )
    .param(
        'specialty_id',
        function (req, res, next, specialty_id) {
            return new Specialties({ id: specialty_id })
                .fetch({ require: true })
                .then(requestedSpecialty => req.requestedSpecialty = requestedSpecialty)
                .then(() => next())
                .catch(next);
        }
    )
    .put(
        '/:specialty_id',
        AdminController.Specialties.Put
    )
    .get(
        '/:specialty_id',
        AdminController.Specialties.Get
    );




module.exports = { SpecialtyRouter };