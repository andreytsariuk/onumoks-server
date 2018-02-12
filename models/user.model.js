const Bookshelf = require('../config/bookshelf');
const knex = Bookshelf.knex;
const Promise = require('bluebird');

const _ = require('lodash');
const { Message, Token } = require('./');
const { AccessTokenHelper } = require('../helpers');

const Role = require('./role.model');
const Book = require('./book.model');

const Profile = require('./profile.model');


module.exports = Bookshelf.model('User', Bookshelf.Model.extend({
    tableName: 'users',
    hidden: ['created_at', 'password'],
    roles: function () {
        return this.belongsToMany('Role');
    },
    books: function () {
        return this.belongsToMany('Book');
    },
    course: function () {
        return this.belongsTo('Courses');
    },
    specialty: function () {
        return this.belongsTo('Specialties');
    },
    profile: function () {
        return this.hasOne('Profile');
    },
    // messages: function () {
    //     return this.hasMany('Message');
    // },
    CreateToken: function (transaction = undefined) {
        let access_token = AccessTokenHelper.generete();
        return this
            .save({ access_token: access_token })
    },
    stats: function (transaction = undefined) {

        return Promise.all([
            this.messages().count(),
            knex('tokens').orderBy('count', 'desc').limit(10),
            knex('messages').where('user_id', this.id).orderBy('created_at', 'desc').limit(10),

        ]).spread(function (totalMessages, mostPopularTokens, lastMessages) {

            this.set('stats', {
                totalMessages,
                mostPopularTokens,
                lastMessages
            });
            return this;
        }.bind(this))
    },

}));
