const Bookshelf = require('../../config/bookshelf');
const knex = Bookshelf.knex;
const Promise = require('bluebird');
const Workspaces = require('./Workspaces.model');


const suid = require('rand-token').suid;

module.exports = Bookshelf.model('LessonTypes', Bookshelf.Model.extend({
    tableName: 'lesson_types',
    hasTimestamps: true,
    workspace() {
        return this.belongsTo('Workspaces');
    }
}));
