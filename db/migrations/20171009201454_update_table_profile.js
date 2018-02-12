
exports.up = function (knex, Promise) {
    return knex.schema.table('profiles', function (column) {

        column
            .string('personal_phone');
        column
            .string('work_phone');
        column
            .string('personal_email');
        column
            .string('work_email');
    });
};

exports.down = function (knex, Promise) {
    return knex.schema
        .table('subjects', function (t) {
            t.dropColumn('personal_phone');
            t.dropColumn('work_phone');
            t.dropColumn('personal_email');
            t.dropColumn('work_email');
        });
};
