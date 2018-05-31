const { Specialties, RolesTypes, Courses } = require('../../db/models');
const _ = require('lodash');
const Promise = require('bluebird');
const Bookshelf = require('../../config/bookshelf');
const knex = Bookshelf.knex;
const Joi = require('joi');

module.exports = class {

    /**
     * Main Schema for all functions
     */
    static get Schema() {
        return {
            Create: {
                body: Joi.object().keys({
                    name: Joi.string().required(),
                    title: Joi.string().required(),
                    code: Joi.string().required(),
                    description: Joi.string().required(),
                })
            },
            Get: {
                query: Joi.object().keys({
                    id: Joi.number().integer().required(),
                })
            },
            List: {
                query: Joi.object().keys({
                    page: Joi.number().integer(),
                    rowsPerPage: Joi.number().integer(),
                    descending: Joi.boolean(),
                    sortBy: Joi.string(),
                    totalItems: Joi.number().integer(),
                    search: Joi.string().empty(''),
                    course: Joi.number().integer(),
                })
            }
        };
    }

    /**
     * Function will return all Specialties with paggination
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    static List(req, res, next) {
        const { descending, sortBy, rowsPerPage, page, search } = req.query;

        return new Specialties()
            .query(qb => {
                if (search) {
                    qb.orWhereRaw(`LOWER(name) LIKE ?`, [`%${_.toLower(search)}%`]);
                    qb.orWhereRaw(`LOWER(title) LIKE ?`, [`%${_.toLower(search)}%`]);
                }
            })
            .orderBy(sortBy ? sortBy : 'created_at', descending === 'true' || !descending ? 'DESC' : 'ASC')
            .fetchPage({
                workspace_id: req.workspace.id,
                pageSize: rowsPerPage, // Defaults to 10 if not specified
                page, // Defaults to 1 if not specified
            })
            .then(result => Promise
                .map(result.models, model => Promise
                    .all([
                        new RolesTypes.Students()
                            .where({
                                workspace_id: req.workspace.id,
                                specialty_id: model.id
                            })
                            .count(),
                        new Courses()
                            .where({
                                workspace_id: req.workspace.id,
                                specialty_id: model.id
                            })
                            .count(),
                    ])
                    .spread((studentsCount, coursesCount) => {
                        model.set('studentsCount', parseInt(studentsCount));
                        model.set('coursesCount', parseInt(coursesCount));
                        return model
                    })

                )
                .then(models => [models, result.pagination])
            )
            .spread((models, pagination) => res.status(200)
                .send({
                    items: models,
                    pagination: pagination
                }))
            .catch(next)
    }

    /**
    * Will create new Specialty
    * @param {*} req 
    * @param {*} res 
    * @param {*} next 
    */
    static Post(req, res, next) {
        return new Specialties({
            workspace_id: req.workspace.id,
            name: req.body.name,
            title: req.body.title,
            code: req.body.code,
            description: req.body.description
        })
            .save()
            .then(newSpecialty => res.status(201).send(newSpecialty))
            .catch(next);
    }

    /**
     * get current user
     * @param {*} req 
     * @param {*} res 
     */
    static Get(req, res, next) {
        return req.requestedSpecialty
            .refresh({ withRelated: ['courses'] })
            .then(specialty => Promise
                .all([
                    new RolesTypes.Students()
                        .where({
                            workspace_id: req.workspace.id,
                            specialty_id: specialty.id
                        })
                        .count(),
                    new Courses()
                        .where({
                            workspace_id: req.workspace.id,
                            specialty_id: specialty.id
                        })
                        .count(),
                ])
                .spread((studentsCount, coursesCount) => {
                    specialty.set('studentsCount', parseInt(studentsCount));
                    specialty.set('coursesCount', parseInt(coursesCount));
                    return specialty
                })
            )
            .then(specialty => res.status(200).send(specialty))
            .catch(next);
    }

    /**
     * Update current User
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    static Put(req, res, next) {

    }
    /**
     * Delete Current User
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    static Delete(req, res, next) {

    }


}