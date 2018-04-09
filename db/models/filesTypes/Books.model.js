const Bookshelf = require('../../../config/bookshelf');
const knex = Bookshelf.knex;
const Promise = require('bluebird');


// const Roles = require('./role.model');
const Users = require('../Users.model');


module.exports = Bookshelf.model('Books', Bookshelf.Model.extend({
    tableName: 'books',
    owner: function () {
        return this.hasOne('Users');
    },
    image: function () {
        return new Promise((resolve, reject) => {
            return resolve(`${process.cwd()}/images/books/${this.get('avatar')}`);
        })
    }
}));
