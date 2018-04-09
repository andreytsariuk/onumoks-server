const Bookshelf = require('../../../config/bookshelf');
const knex = Bookshelf.knex;
const Promise = require('bluebird');
const Roles = require('../Roles.model');
const Users = require('../Users.model');


module.exports = Bookshelf.model('Lectors', Bookshelf.Model.extend({
    tableName: 'lectors',
    user: function () {
        return this.belongsTo('Users');
    },
    role() {
        return this.morphOne('Roles', 'role');
    }

}));
