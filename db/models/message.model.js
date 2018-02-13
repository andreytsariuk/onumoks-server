const Bookshelf = require('../config/bookshelf');
const knex = Bookshelf.knex;
const Promise = require('bluebird');

const _ = require('lodash');
const { User, Token } = require('./');


module.exports = Bookshelf.model('Message', Bookshelf.Model.extend({
    tableName: 'messages',
    hidden: ['created_at'],
    user: function () {
        return this.belongsTo('User');
    },
    tokens: function () {
        return this.hasMany('Token');
    },
    stats: function (transaction = undefined) {

        return Promise
            .all([
                this.tokens()
                    .count()
                    .fetch({ transacting: transaction }),

                knex('messages_tokens')
                    .where('message_id', this.id)
                    .orderBy('count', 'asc')
                    .transacting(transaction),
            ])
            .spread(function (totalTokens, mostPopularTokens) {
                this.set('stats', {
                    totalMessages,
                    mostPopularTokens
                });
                return this;
            }
                .bind(this))
    },

}));
