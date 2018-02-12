const Bookshelf = require('../config/bookshelf');
const knex = Bookshelf.knex;
const Promise = require('bluebird');


module.exports = Bookshelf.model('Specialties', Bookshelf.Model.extend({
    tableName: 'specialties',
    hasTimestamps: true,
    courses() {
        return this.hasMany('Courses');
    },
    coursesCount() {
        return this.courses ? this.courses.length : 0;
    }

}));
