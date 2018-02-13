const Bookshelf = require('../config/bookshelf');
const knex = Bookshelf.knex;
const Promise = require('bluebird');

const _ = require('lodash');
const { Message, Token } = require('./');
const { AccessTokenHelper } = require('../helpers');

const Role = require('./role.model');
const User = require('./user.model');


module.exports = Bookshelf.model('Book', Bookshelf.Model.extend({
    tableName: 'books',
    owner: function () {
        return this.hasOne('User');
    },
    image: function () {
        return new Promise((resolve, reject) => {
            return resolve(`${process.cwd()}/images/books/${this.get('avatar')}`);
        })
    }
}));
