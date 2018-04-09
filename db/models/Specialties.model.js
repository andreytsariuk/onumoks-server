const Bookshelf = require('../../config/bookshelf');
const knex = Bookshelf.knex;
const Promise = require('bluebird');
const Workspaces = require('./Workspaces.model');
const Courses = require('./Courses.model');

module.exports = Bookshelf.model('Specialties', Bookshelf.Model.extend({
    tableName: 'specialties',
    hasTimestamps: true,
    courses() {
        return this.hasMany('Courses');
    },
    workspace() {
        return this.belongsTo('Workspaces');
    },

}));
