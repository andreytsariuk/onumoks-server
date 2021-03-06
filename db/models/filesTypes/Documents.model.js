
const Bookshelf = require('../../../config/bookshelf');
const knex = Bookshelf.knex;
const Promise = require('bluebird');
const Profiles = require('../Profiles.model');
const Files = require('../Files.model');


module.exports = Bookshelf.model('Documents', Bookshelf.Model.extend({
    tableName: 'documents',
    file() {
        return this.morphOne('Files', 'file');
    }
}));
