const { RequireFilter } = require('../../filters');
const md5 = require('md5');
const { Courses, RolesTypes } = require('../../db/models');
const Errors = require('../../errors');
const _ = require('lodash');
const Promise = require('bluebird');
const Bookshelf = require('../../config/bookshelf');
const knex = Bookshelf.knex;
const requireFields = {
    Post: ['title', 'level', 'specialty_id'],
    Het: ['id'],
    List: ['page', 'rowsPerPage']
}

module.exports = class {

    /**
     * Function will return all Courses with paggination
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    static List(req, res, next) {
        const { descending, sortBy } = req.query;

        return RequireFilter
            .Check(req.query, requireFields.List)
            .then(validated => new Courses()
                .orderBy(sortBy ? sortBy : 'created_at', descending === 'true' || !descending ? 'DESC' : 'ASC')
                .fetchPage({
                    workspace_id: req.workspace.id,
                    pageSize: validated.rowsPerPage, // Defaults to 10 if not specified
                    page: validated.page, // Defaults to 1 if not specified
                    withRelated: ['specialty']
                }))
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
        return RequireFilter
            .Check(req.body, requireFields.Post)
            .then(validated => new Courses({
                workspace_id: req.workspace.id,
                title: validated.title,
                level: validated.level,
                specialty_id: validated.specialty_id,
                description: validated.description
            }).save())
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