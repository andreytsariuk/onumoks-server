
const Bookshelf = require('../../../config/bookshelf');
const knex = Bookshelf.knex;
const Promise = require('bluebird');
const Profiles = require('../Profiles.model');
const Files = require('../Files.model');


module.exports = Bookshelf.model('Images', Bookshelf.Model.extend({
    tableName: 'images',
    profile() {
        return this.belongsTo('Profiles');
    },
    files() {
        return this.morphOne('Files', 'file');
    }
}));
