const Bookshelf = require('../../config/bookshelf');
const knex = Bookshelf.knex;
const suid = require('rand-token').suid;
const moment = require('moment');
const promise = require('bluebird');

module.exports = Bookshelf.model('Invites', Bookshelf.Model.extend({
    tableName: 'invites',
    //	hidden: ['created_at', 'updated_at'],
    hasTimestamps: true,
    initialize: function () {
        this.on('creating', this.beforeSave);
        this.on('fetched', this.afterFetched);
    },
    beforeSave: function () {
        this.attributes.token = suid(16);
        return this;
    },
    afterFetched(collection, response, options) {
        console.log('collection', collection);
        console.log('response', response);
        console.log('options', options);
        return collection;
    },
    user: function () {
        const Users = require('./Users.model');

        return this.belongsTo('Users');
    },
    validate(params = { useExpires: true }) {
        //check For Errors;
        return new Promise((resolve, reject) => {
            switch (true) {
                case moment(this.get('expires_at')) < moment() && params.useExpires:
                    return reject(new Error('invite_expired'));

                case this.get('used'):
                    return reject(new Error('invite_incorrect'));

                default:
                    return resolve(this);
            }
        });
    },
    markAsUsed(email) {
        return this.where({
            email
        })
            .fetchAll()
            .then(result => Promise.map(result.models, model => model.save({
                used: true
            }, { method: 'update' })))
    }

}));