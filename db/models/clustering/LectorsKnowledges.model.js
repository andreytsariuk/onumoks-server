const Bookshelf = require('../../../config/bookshelf');
const Knowledges = require('./Knowledges.model');
const { Lectors } = require('../rolesTypes');

module.exports = Bookshelf.model('LectorsKnowledges', Bookshelf.Model.extend({
  tableName: 'lectors_knowledges',
  hasTimestamps: true,
  knowledge: function () {
    return this.belongsTo('Knowledges');
  },
  lector: function () {
    return this.belongsTo('Lectors');
  },
  virtuals: {
    // students_count: function () {
    //   return this.related('students').length;
    // },
    // groups_count: function () {
    //   return this.related('groups').length;
    // },
    // courses_count: function () {
    //   return this.related('courses').length;
    // }
  }

}));
