const { Groups, RolesTypes, Courses } = require('../../db/models');
const Errors = require('../../errors');
const _ = require('lodash');
const Promise = require('bluebird');
const Bookshelf = require('../../config/bookshelf');
const knex = Bookshelf.knex;
const requireFields = {
    Post: ['title'],
    Het: ['id'],
    List: ['page', 'rowsPerPage']
}
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
                    description: Joi.string().required(),

                    students_ids: Joi.array().items(Joi.number().integer()).required(),
                    course_id: Joi.number().integer().required(),
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
     * Function will return all Groups with paggination
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    static List(req, res, next) {
        const { descending, sortBy, rowsPerPage, page, search, course } = req.query;

        return new Groups()
            .query(qb => {
                if (search) {
                    qb.orWhereRaw(`LOWER(title) LIKE ?`, [`%${_.toLower(search)}%`])
                }
                if (course)
                    qb.where('course_id', course);

            })
            .orderBy(sortBy ? sortBy : 'created_at', descending === 'true' || !descending ? 'DESC' : 'ASC')
            .fetchPage({
                workspace_id: req.workspace.id,
                pageSize: rowsPerPage, // Defaults to 10 if not specified
                page,// Defaults to 1 if not specified
                withRelated: ['course', 'course.specialty', 'students']
            })
            .then(result => res.status(200)
                .send({
                    items: result.toJSON(),
                    pagination: result.pagination
                }))
            .catch(next);
    }

    /**
    * Will create new Group
    * @param {*} req 
    * @param {*} res 
    * @param {*} next 
    */
    static Post(req, res, next) {
        return new Groups({
            workspace_id: req.workspace.id,
            course_id: req.body.course_id,
            title: req.body.title,
            description: req.body.description
        })
            .save()
            .tap(newGroup => {
                if (req.body.students_ids)
                    return newGroup.students().attach(req.body.students_ids);
                else
                    return Promise.resolve();
            })
            .then(newGroup => res.status(201).send(newGroup))
            .catch(next);
    }

    /**
     * get current user
     * @param {*} req 
     * @param {*} res 
     */
    static Get(req, res, next) {
        return req.requestedGroup
            .refresh({ withRelated: ['cource', 'cource.specialty', 'students'] })
            .then(group => res.status(200).send(group))
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
        return req.requestedGroup.destroy()
            .then(group => res.status(200).send({
                code: 'group_deleted'
            }))
            .catch(next);
    }

    static MultiDelete(req, res, next) {
        const { groups_ids } = req.query;
        return new Groups()
            .query(qb => qb.whereIn('id', groups_ids))
            .fetchAll(result => Promise
                .map(result.models, model => model.destroy()))
            .then(() => res.status(200).send({
                code: 'groups_deleted'
            }))
            .catch(next);
    }


}