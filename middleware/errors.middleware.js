const Promise = require('bluebird');
let { Server, User } = require('../errors');


module.exports = function ErrorsMiddleware(error, req, res, next) {
    console.log('==================================ERROR MIDDLEWARE==================================');
    console.log('-------------MESSAGE-------------:\n', error.message);
    console.log('--------------ERROR--------------:\n', error);
    console.log('==================================END ERROR MIDDLEWARE==================================');


    switch (true) {
        //------------------------Authorization Section------------------
        case error instanceof Server.Unauthorize:
            return error.run(res);
        case error instanceof Server.InvalidCredentials:
            return error.run(res);

        //---------------------Server Section------------------
        case error instanceof Server.Conflict:
            return error.run(res);
        case error.code === '23505':
            res.status(409).send({
                code: error.constraint,
                description: `The same ${String(error.table).slice(0, error.table.length - 1)} already exist`
            })
        case error instanceof Server.Conflict:
            return error.run(res);
        case error instanceof Server.FileDoesNotExist:
            return error.run(res);

        case error.isJoi:
            return res.status(409).send({
                code: 'validation_failed',
                description: error.details[0].message
            })
        //------------------------User Section------------------
        case error instanceof User.EmailExist:
            return error.run(res);

        default:
            error = new Server.Default(500, error.message);
            return error.run(res);
    }
};