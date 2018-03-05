const Bookshelf = require('../../config/bookshelf');
const knex = Bookshelf.knex;
const Users = require('./Users.model');
const suid = require('rand-token').suid;
const moment = require('moment');
const Promise = require('bluebird');

module.exports = Bookshelf.model('VerificationTokens', Bookshelf.Model.extend({
    tableName: 'verification_tokens',
    hidden: ['created_at', 'updated_at'],
    hasTimestamps: true,
    initialize: function () {
        this.on('creating', this.beforeSave);
    },
    beforeSave: function () {
        this.attributes.token = suid(16);
        this.attributes.expires_at = moment().add('7', 'days').toISOString();
        return this;
    },
    user: function () {
        return this.belongsTo('Users');
    },
    validate(params = { useExpires: true }) {
        //check For Errors;
        return new Promise((resolve, reject) => {
            switch (true) {
                case moment(this.get('expires_at')) < moment() && params.useExpires:
                    return reject(new Error('verification_token_expired'));

                case this.get('used'):
                    return reject(new Error('verification_token_already_used'));

                default:
                    return resolve(this);
            }
        });
    },
    markAsUsed(user_id, token_type) {
        return this.where({
            user_id,
            token_type
        })
            .fetchAll()
            .then(result => Promise.map(result.models, model => model.save({
                used: true
            }, { method: 'update' })))
    }

}));