const Bookshelf = require('../config/bookshelf');
const knex = Bookshelf.knex;
const Promise = require('bluebird');

const _ = require('lodash');
const { Message, Token } = require('./');


module.exports = Bookshelf.model('Token', Bookshelf.Model.extend({
    tableName: 'tokens',
    messages: function () {
        return this.hasMany('Message');
    }
}));
