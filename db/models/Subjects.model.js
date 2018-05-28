const Bookshelf = require('../../config/bookshelf');
const knex = Bookshelf.knex;
const Promise = require('bluebird');
const Workspaces = require('./Workspaces.model');


const suid = require('rand-token').suid;

module.exports = Bookshelf.model('Subjects', Bookshelf.Model.extend({
    tableName: 'subjects',
    hasTimestamps: true,
    workspace() {
        return this.belongsTo('Workspaces');
    }
    // virtuals: {
    //     studentsCount: function () {
    //         return knex('students').where('workspace_id', this.get('workspace_id')).andWhere('specialty_id', this.id).count()
    //             .then(res => {
    //                 let [{ count }] = res
    //                 return count;
    //             })
    //     }
    // }
}));
