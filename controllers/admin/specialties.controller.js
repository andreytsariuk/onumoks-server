const { RequireFilter } = require('../../filters');
const md5 = require('md5');
const { Specialties, RolesTypes, Courses } = require('../../db/models');
const Errors = require('../../errors');
const _ = require('lodash');
const Promise = require('bluebird');
const Bookshelf = require('../../config/bookshelf');
const knex = Bookshelf.knex;
const requireFields = {
    Post: ['name', 'title'],
    Het: ['id'],
    List: ['page', 'rowsPerPage']
}

module.exports = class {

    /**
     * Function will return all Specialties with paggination
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    static List(req, res, next) {
        const { descending, sortBy } = req.query;

        return RequireFilter
            .Check(req.query, requireFields.List)
            .then(validated => new Specialties()
                .orderBy(sortBy ? sortBy : 'created_at', descending === 'true' || !descending ? 'DESC' : 'ASC')
                .fetchPage({
                    workspace_id: req.workspace.id,
                    pageSize: validated.rowsPerPage, // Defaults to 10 if not specified
                    page: validated.page, // Defaults to 1 if not specified
                }))
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
        return RequireFilter
            .Check(req.body, requireFields.Post)
            .then(validated => new Specialties({
                workspace_id: req.workspace.id,
                name: validated.name,
                title: validated.title,
                code: validated.code,
                description: validated.description
            }).save())
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