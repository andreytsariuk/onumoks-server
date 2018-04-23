const Bookshelf = require('../../config/bookshelf');
const knex = Bookshelf.knex;
const Promise = require('bluebird');
const Workspaces = require('./Workspaces.model');
const Courses = require('./Courses.model');
const Students = require('./rolesTypes/Students.model');


const suid = require('rand-token').suid;

module.exports = Bookshelf.model('Specialties', Bookshelf.Model.extend({
    tableName: 'specialties',
    hasTimestamps: true,
    initialize: function () {
        this.on('creating', this.beforeSave);
        this.on('fetched', function (model, columns) {
            console.log('model', model.toJSON())
        });
    },
    beforeSave: function () {
        this.attributes.code = this.attributes.code ? this.attributes.code : suid(4);
        return this;
    },
    students() {
        return this.hasMany('Students');
    },
    courses() {
        return this.hasMany('Courses');
    },
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
