const { Courses, RolesTypes } = require('../../db/models');
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
                    title: Joi.string().required(),
                    level: Joi.number().integer().required(),
                    description: Joi.string().required(),
                    specialty_id: Joi.number().integer().required(),
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
                })
            }
        };
    }

    /**
     * Function will return all Courses with paggination
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    static List(req, res, next) {
        const { descending, sortBy, rowsPerPage, page, search } = req.query;

        return new Courses()
            .query(qb => {
                if (search) {
                    qb.orWhereRaw(`LOWER(name) LIKE ?`, [`%${_.toLower(search)}%`]);
                }
            })
            .orderBy(sortBy ? sortBy : 'created_at', descending === 'true' || !descending ? 'DESC' : 'ASC')
            .fetchPage({
                workspace_id: req.workspace.id,
                pageSize: rowsPerPage, // Defaults to 10 if not specified
                page, // Defaults to 1 if not specified
                withRelated: ['specialty', 'students', 'students.user']
            })
            .then(result => Promise
                .map(result.models, model => Promise
                    .all([
                        new RolesTypes.Students()
                            .where({
                                workspace_id: req.workspace.id,
                                course_id: model.id
                            })
                            .count()
                    ])
                    .spread((studentsCount, coursesCount) => {
                        model.set('studentsCount', parseInt(studentsCount));
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
     * Will create new Course
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    static Post(req, res, next) {
        return new Courses({
            workspace_id: req.workspace.id,
            title: req.body.title,
            level: req.body.level,
            specialty_id: req.body.specialty_id,
            description: req.body.description
        })
            .save()
            .then(newCourse => res.status(201).send(newCourse))
            .catch(next);
    }

    /**
     * get current user
     * @param {*} req 
     * @param {*} res 
     */
    static Get(req, res, next) {
        return req.requestedCourse
            .refresh({
                withRelated: ['profile', 'profile.avatar']
            })
            .then(user => res.status(200).send(user))
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
        return req.requestedCourse.destroy()
            .then(group => res.status(200).send({
                code: 'course_deleted'
            }))
            .catch(next);
    }


}