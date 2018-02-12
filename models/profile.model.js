const Bookshelf = require('../config/bookshelf');
const Promise = require('bluebird');
const User = require('./user.model');

module.exports = Bookshelf.model('Profile', Bookshelf.Model.extend({
    tableName: 'profiles',
    hidden: ['avatar' ],    
    avatar: function () {
        return new Promise((resolve, reject) => {
            return resolve(`${process.cwd()}/images/avatars/${this.get('avatar')}`);
        })
    }
}));
