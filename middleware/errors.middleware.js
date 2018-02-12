const Promise = require('bluebird');
let { Server, User } = require('../errors');


module.exports = function ErrorsMiddleware(error, req, res, next) {
    console.log('error', error);

    switch (true) {
        //------------------------Authorization Section------------------
        case error instanceof Server.Unauthorize:
            return error.run(res);
        case error instanceof Server.InvalidCredentials:
            return error.run(res);

        //---------------------Server Section------------------
        case error instanceof Server.Conflict:
            return error.run(res);
        case error instanceof Server.Conflict:
            return error.run(res);
        case error instanceof Server.FileDoesNotExist:
            return error.run(res);

        //------------------------User Section------------------
        case error instanceof User.EmailExist:
            return error.run(res);

        default:
            error = new Server.Default(500, error.message);
            return error.run(res);
    }
};