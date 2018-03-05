const { Roles, Subscriptions, Plans, Users, Invites } = require('../db/models');
const Promise = require('bluebird');
const config = require('config');
const _ = require('lodash');
const moment = require('moment');




module.exports = class InviteRulesHelper {



    static validate(rules) {
        if (!rules || _.isNull(rules))
            throw new Error('not_valid_invite_rules');

        let rulesObject = {
            roles: []
        }


        let validKeys = _.map(rulesObject, (value, key) => key);
        let validTypes = _.map(rulesObject, (value, key) => value);


        _.forIn(rules, (value, key) => {
            let index = validKeys.indexOf(key);
            if (index === -1)
                throw new Error('not_valid_invite_rules');

            if (typeof (value) !== typeof (validTypes[index]))
                throw new Error('not_valid_invite_rules');
        });
        console.log('rules.roles', rules.roles)
        return Promise
            .map(rules.roles,
                role => new Promise((resolve, reject) => {
                    if (InviteRulesHelper.RolesWhiteList.indexOf(role) !== -1) {
                        rulesObject.roles.push(role);
                        return resolve();
                    }
                    else
                        reject(new Error('not_valid_invite_rules'));
                })
            )
            .then(() => ({
                valid: true,
                rulesObject
            }));
    }



    static applyRules(rulesObject, user) {
        //attach roles	
        return Promise
            .map(rulesObject.roles, ({ role_type, role_id }) => user.roles().create({
                role_type,
                role_id
            }))
            .then(() => user.refresh({ withRelated: ['roles'] }))
            .then(user => user)



    }


    static get RolesWhiteList() {
        return ['admins', 'lectors', 'students']
    }

}