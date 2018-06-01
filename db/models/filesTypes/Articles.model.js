const Bookshelf = require('../../../config/bookshelf');
const knex = Bookshelf.knex;
const Promise = require('bluebird');
const { Lectors } = require('../rolesTypes');
const { Clusters } = require('../clustering');


module.exports = Bookshelf.model('Articles', Bookshelf.Model.extend({
    tableName: 'articles',
    owner: function () {
        return this.belongsTo('Lectors');
    },
    cluster: function () {
        return this.belongsTo('Clusters');
    },
}));
