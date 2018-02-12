
exports.up = function (knex, Promise) {
    return knex.schema.table('users', function (table) {
        table
            .bigInteger('specialty_id')
            .references('specialties.id')         
        table
            .bigInteger('course_id')
            .references('courses.id')          
    });
};

exports.down = function (knex, Promise) {
    return knex.schema
        .table('users', function (t) {
            t.dropColumn('specialty_id');
            t.dropColumn('course_id');
        });
};
