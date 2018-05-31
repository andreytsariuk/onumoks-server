'use strict'
const Promise = require('bluebird');
const _ = require('lodash');
const moment = require('moment');
const { RequireFilter } = require('../../filters');
const config = require('config');
const { Invites } = require('../../db/models')
const { InviteRulesHelper } = require('../../helpers')
const requireFields = {
    Get: ['token'],
}


module.exports = class {
    /**
     * get and validate invite by it token 
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    static get(req, res, next) {
        return new Invites()
            .where({
                token: req.query.token
            })
            .fetch({
                require: true,
                withRelated: ['workspace', 'workspace.avatar']
            })
            .then(invite => res.status(200).send(invite))
            .catch(next);
    }


}