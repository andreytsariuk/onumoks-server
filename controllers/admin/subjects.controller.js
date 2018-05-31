const { Subjects } = require('../../db/models');
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
     * Function will return all Subjects with paggination
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    static List(req, res, next) {
        const { descending, sortBy, rowsPerPage, page, search, course } = req.query;

        return new Subjects()
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
            .then(result => res.status(200)
                .send({
                    items: result.toJSON(),
                    pagination: result.pagination
                }))
            .catch(next)
    }

    /**
    * Will create new Subject
    * @param {*} req 
    * @param {*} res 
    * @param {*} next 
    */
    static Post(req, res, next) {
        return new Subjects({
            workspace_id: req.workspace.id,
            name: req.body.name,
            title: req.body.title,
            description: req.body.description
        })
            .save()
            .then(newSubject => res.status(201).send(newSubject))
            .catch(next);
    }

    /**
     * get current user
     * @param {*} req 
     * @param {*} res 
     */
    static Get(req, res, next) {
        return res.status(200).send(req.requestedSubject);
    }


    /**
     * Will Update current Subject
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    static Put(req, res, next) {
        return RequireFilter
            .Check(req.body, requireFields.Put)
            .then(validated => req.requestedSubject.save({
                name: validated.name,
                title: validated.title,
                description: validated.description
            }))
            .then(newSubject => res.status(200).send(newSubject))
            .catch(next);
    }


    /**
     * Delete Current User
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    static Delete(req, res, next) {
        return req.requestedSubject
            .destroy()
            .then(() => res.status(200).send({
                code: 'subject_deleted'
            }))
            .catch(next);
    }

    static MultiDelete(req, res, next) {
        const { subjects_ids } = req.query;
        return new Subjects()
            .query(qb => qb.whereIn('id', subjects_ids))
            .fetchAll(result => Promise
                .map(result.models, model => model.destroy()))
            .then(() => res.status(200).send({
                code: 'subjects_deleted'
            }))
            .catch(next);
    }


}