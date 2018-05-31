const Bookshelf = require('../../../config/bookshelf');
const Knowledges = require('./Knowledges.model');
const Keywords = require('./Keywords.model');

module.exports = Bookshelf.model('KeywordsKnowledges', Bookshelf.Model.extend({
  tableName: 'keywords_knowleges',
  hasTimestamps: true,
  knowledge: function () {
    return this.belongsTo('Knowledges');
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
