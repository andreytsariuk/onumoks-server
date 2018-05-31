'use strict'
const Promise = require('bluebird');
const _ = require('lodash');
const moment = require('moment');
const { Invites, Tokens, Users, } = require('../../db/models')
const { EmailService } = require('../../services')
const { InviteRulesHelper } = require('../../helpers')
const Joi = require('joi');


module.exports = class {

    /**
     * Main Schema for all functions
     */
    static get Schema() {
        return {
            Create: {
                body: Joi.object().keys({
                    email: Joi.string().required(),
                    name: Joi.string().required(),
                    rules: Joi.any().required(),
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
    * get all exist invites
    * @param {*} req 
    * @param {*} res 
    * @param {*} next 
    */
    static List(req, res, next) {
        const { descending, sortBy, rowsPerPage, page, search } = req.query;

        return new Invites()
            .query(qb => {
                if (search) {
                    qb.orWhereRaw(`LOWER(email) LIKE ?`, [`%${_.toLower(search)}%`]);
                }
            })
            .where({
                workspace_id: req.workspace.id
            })
            .orderBy(sortBy ? sortBy : 'created_at', descending === 'true' || !descending ? 'DESC' : 'ASC')
            .fetchPage({
                pageSize: rowsPerPage,
                page,
                withRelated: ['user']
            })

            .then(result => res.status(200).send({
                data: result.toJSON(),
                pagination: result.pagination
            }))
            .catch(next)
    }

    /**
     * Create new Invite by email and rules 
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    static create(req, res, next) {
        return new Users()
            .where({
                email: req.body.email,
                workspace_id: req.workspace.id
            })
            .fetchAll()
            .then(result => {
                console.log('result', result)
                if (result.models.length > 0)
                    throw new Error('user_already_registered')
                else
                    return;
            })
            .then(() => InviteRulesHelper.validate(req.body.rules))
            .then(result => new Invites({
                email: req.body.email,
                workspace_id: req.workspace.id,
                name: req.body.name ? req.body.name : '-',
                rules: JSON.stringify(req.body.rules),
                expires_at: moment().add(24, 'hours').toISOString()
            }).save())
            .tap(invite => EmailService.sendInvite(invite.get('name'), invite.get('token'), invite.get('email'), req.workspace.toJSON()))
            .tap(invite => res.status(201).send(invite))
            .catch(next);
    }


    /**
     * Delete Current Invite by id
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    static delete(req, res, next) {
        return req.invite.destroy()
            .then(() => res.status(200).send({
                code: 'removed'
            }))
            .catch(next);
    }


    /**
     * get and validate invite by it token 
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    static get(req, res, next) {
        return req.invite.validate()
            .then(invite => res.status(200).send(invite))
            .catch(next);
    }




}