const { Positions } = require('../../db/models');
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
                    hours_count: Joi.number().required(),
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

        return new Positions()
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
            })
            .then(result => res.status(200)
                .send({
                    items: result.toJSON(),
                    pagination: result.pagination
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
        return new Positions({
            workspace_id: req.workspace.id,
            name: req.body.name,
            title: req.body.title,
            description: req.body.description,
            hours_count: req.body.hours_count
        })
            .save()
            .then(newPosition => res.status(201).send(newPosition))
            .catch(next);
    }

    /**
     * get current position
     * @param {*} req 
     * @param {*} res 
     */
    static Get(req, res, next) {
        return res.status(200).send(req.requestedPosition);
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