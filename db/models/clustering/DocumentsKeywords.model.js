const Bookshelf = require('../../../config/bookshelf');
const { Documents } = require('../filesTypes');
const Keywords = require('./Keywords.model');

module.exports = Bookshelf.model('DocumentsKeywords', Bookshelf.Model.extend({
  tableName: 'documents_keywords',
  hasTimestamps: true,
  document: function () {
    return this.belongsTo('Documents');
  },
  keyword: function () {
    return this.belongsTo('Keywords');
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
