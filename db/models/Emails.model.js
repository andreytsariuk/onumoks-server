const Bookshelf = require('../../config/bookshelf');
const knex = Bookshelf.knex;
const Users = require('./Users.model');


module.exports = Bookshelf.model('Emails', Bookshelf.Model.extend({
    tableName: 'emails',
    // hidden: ['created_at', 'updated_at'],
    hasTimestamps: true,
    user: function () {
        return this.belongsTo('Users');
    }

}));