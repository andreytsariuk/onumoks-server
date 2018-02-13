const Bookshelf = require('../config/bookshelf');
const Promise = require('bluebird');
const User = require('./user.model');

module.exports = Bookshelf.model('Profile', Bookshelf.Model.extend({
    tableName: 'profiles',
    hidden: [],
    avatars: function () {
        return this.hasMany('Avatars');
    }
}));
