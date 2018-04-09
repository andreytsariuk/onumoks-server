
const Bookshelf = require('../../config/bookshelf');
const knex = Bookshelf.knex;
const Promise = require('bluebird');
const Users = require('./Users.model');
const Profiles = require('./Profiles.model');
const { Avatars, Books, Documents, Images } = require('./filesTypes');


module.exports = Bookshelf.model('Files', Bookshelf.Model.extend({
    tableName: 'files',
    file() {
        return this.morphTo('file', 'Avatars', 'Books', 'Documents', 'Images');
    },
    user: function () {
        return this.belongsTo('Users');
    },
}));
