
exports.up = function (knex, Promise) {
    return knex.schema.table('specialties', function (t) {
        t.string('description');
    });
};

exports.down = function (knex, Promise) {
    return knex.schema
        .table('specialties', function (t) {
            t.dropColumn('description');
        });
};
