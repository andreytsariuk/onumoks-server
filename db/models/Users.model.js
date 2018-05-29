const Bookshelf = require('../../config/bookshelf');
const knex = Bookshelf.knex;
const Promise = require('bluebird');
const _ = require('lodash');

const Roles = require('./Roles.model');
const Profiles = require('./Profiles.model');
const Workspaces = require('./Workspaces.model')


module.exports = Bookshelf.model('Users', Bookshelf.Model.extend({
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
            .then(user => user.roles.indexOf(roleName) !== -1 || rolesArray.indexOf(`${roleName}s`) !== -1);
    },
    virtuals: {
        name: function () {
            return this.related('profile').get('lname') + ' ' + this.related('profile').get('fname');
        },
        short_roles: function () {
            return this.related('roles').map(role => role.get('role_type'));
        }
    }

}));
