'use strict'
const Promise = require('bluebird');
const _ = require('lodash');
const moment = require('moment');
const { RequireFilter } = require('../../filters');
const config = require('config');
const { Invites, Tokens, Roles, Users, } = require('../../db/models')
const { EmailService } = require('../../services')
const { InviteRulesHelper } = require('../../helpers')
const requireFields = {
    Create: ['email', 'rules', 'name'],
    Get: [],
    List: ['page', 'rowsPerPage']
}

module.exports = class {

    /**
     * Create new Invite by email and rules 
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    static create(req, res, next) {



        return RequireFilter
            .Check(req.body, requireFields.Create)
            .then(validated => new Users()
                .where({
                    email: validated.email,
                    workspace_id: req.workspace.id
                })
                .fetchAll()
            )
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


    /**
     * get all exist invites
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    static list(req, res, next) {
        const { descending, sortBy } = req.query;

        return RequireFilter
            .Check(req.query, requireFields.List)
            .then(validated => new Invites()
                .where({
                    workspace_id: req.workspace.id
                })
                .orderBy(sortBy ? sortBy : 'created_at', descending === 'true' || !descending ? 'DESC' : 'ASC')
                .fetchPage({
                    pageSize: validated.rowsPerPage,
                    page: validated.page,
                    withRelated: ['user']
                })
            )
            .then(result => res.status(200).send({
                data: result.toJSON(),
                pagination: result.pagination
            }))
            .catch(next)
    }

}