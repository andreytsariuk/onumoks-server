const Bookshelf = require('../../config/bookshelf');
const Promise = require('bluebird');

module.exports = Bookshelf.model('Profiles', Bookshelf.Model.extend({
    tableName: 'profiles',
    hidden: [],
    avatars: function () {
        return this.hasMany('Avatars');
    }
}));
