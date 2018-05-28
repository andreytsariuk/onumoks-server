const Bookshelf = require('../../config/bookshelf');
const knex = Bookshelf.knex;
const Promise = require('bluebird');
const Specialties = require('./Specialties.model');


module.exports = Bookshelf.model('Courses', Bookshelf.Model.extend({
    tableName: 'courses',
    hasTimestamps: true,
    specialty: function () {
        return this.belongsTo('Specialties');
    },
    students: function () {
        return this.hasMany('Students');
    }

}));
