const Bookshelf = require('../config/bookshelf');
const knex = Bookshelf.knex;
const Promise = require('bluebird');

const _ = require('lodash');
const { Message, Token } = require('./');
const { AccessTokenHelper } = require('../helpers');

const Role = require('./role.model');
const Book = require('./book.model');

const Profile = require('./profile.model');


module.exports = Bookshelf.model('Subject', Bookshelf.Model.extend({
    tableName: 'subjects',
    books: function () {
        return this.belongsToMany('Book');
    }
}));
