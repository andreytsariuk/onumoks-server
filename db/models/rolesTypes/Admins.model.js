const Bookshelf = require('../config/bookshelf');
const knex = Bookshelf.knex;
const Promise = require('bluebird');
const Roles = require('./Roles.model');
const Users = require('./Users.model');


module.exports = Bookshelf.model('Admins', Bookshelf.Model.extend({
    tableName: 'admins',
    user: function () {
        return this
            .refresh({
                withRelated: ['role', 'role.user']
            })
            .then(role => role.related('user'))
    },
    role() {
        return this.morphOne('Roles', 'role');
    }

}));
