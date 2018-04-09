const Bookshelf = require('../../../config/bookshelf');
const knex = Bookshelf.knex;
const Promise = require('bluebird');
const Roles = require('../Roles.model');
const Users = require('../Users.model');


module.exports = Bookshelf.model('Students', Bookshelf.Model.extend({
    tableName: 'students',
    user: function () {
        return this.belongsTo('Users');
    },
    role() {
        return this.morphOne('Roles', 'role');
    }

}));
