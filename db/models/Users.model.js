const Bookshelf = require('../../config/bookshelf');
const knex = Bookshelf.knex;
const Promise = require('bluebird');
const _ = require('lodash');

const Roles = require('./Roles.model');
const Profiles = require('./Profiles.model');
const Workspaces = require('./Workspaces.model')

module.exports = Bookshelf.model('User', Bookshelf.Model.extend({
    tableName: 'users',
    hidden: ['password'],
    hasTimestamps: true,
    roles: function () {
        return this.hasMany('Roles');
    },
    profile: function () {
        return this.hasOne('Profiles');
    },
    workspace() {
        return this.belongsTo('Workspaces');

    },
    is: function (roleName) {
        let answer = false;
        return this
            .refresh({
                withRelated: ['roles']
            })
            .then(user => {
                let roleArray = user.related('roles').map(role => role.get('role_type'));
                return rolesArray.indexOf(roleName) !== -1 || rolesArray.indexOf(`${roleName}s`) !== -1
            });
    },
    // virtuals: {
    //     fullName: function () {
    //         return this.get('firstName') + ' ' + this.get('lastName');
    //     }
    // }

}));
