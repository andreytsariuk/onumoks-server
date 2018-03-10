const Bookshelf = require('../../config/bookshelf');
const Promise = require('bluebird');
const Users = require('./Users.model');


module.exports = Bookshelf.model('Profiles', Bookshelf.Model.extend({
    tableName: 'profiles',
    hidden: [],
    avatar: function () {
        return this.belongsTo('Avatars');
    },
    user: function () {
        return this.belongsTo('Users');
    },
}));
