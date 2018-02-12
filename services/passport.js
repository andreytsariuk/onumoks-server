const PassportJWT = require('passport-jwt'),
    ExtractJWT = PassportJWT.ExtractJwt,
    Strategy = PassportJWT.Strategy,
    config = require('config'),
    { User } = require('../models');

module.exports = (passport) => {

    const parameters = {
        secretOrKey: config.secret,
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
    };
    passport.use(new Strategy(parameters, (payload, callback) => {

        new User({
            id: payload.id
        })
            .fetch({ require: true })
            .then(user => callback(null, user))
            .cathc(error => {
                switch (true) {
                    case error instanceof User.NotFoundError:
                        return callback(null, false);

                    default:
                        return callback(error, false);
                }
            })
    }));
}