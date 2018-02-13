const Bookshelf = require('../config/bookshelf');
const knex = Bookshelf.knex;
const Promise = require('bluebird');


module.exports = Bookshelf.model('Courses', Bookshelf.Model.extend({
    tableName: 'courses',
    hasTimestamps: true,
    specialty: function () {
        return this.belongsTo('Specialties');
    },

}));
