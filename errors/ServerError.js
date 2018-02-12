module.exports.Default = class Default extends Error {

    constructor(code, message) {
        message = message ? message : 'Oops something went wrong...';
        super(message);
        this.code = code ? code : 500;
    }

    run(res) {
        res.status(this.code).send(this.message);
    }

}


module.exports.Conflict = class Conflict extends Error {

    constructor(code, message) {
        message = message ? message : 'There no required data.';
        super(message);
        this.code = code ? code : 409;
    }

    run(res) {
        res.status(this.code).send(this.message);
    }

}

module.exports.Unauthorize = class Unauthorize extends Error {

    constructor() {
        super('Unauthorize');
        this.code = 401;
    }

    run(res) {
        res.status(401).send(this.message);
    }

}


module.exports.InvalidCredentials = class Unauthorize extends Error {

    constructor() {
        super('Invalid Credentials');
        this.code = 403;
    }

    run(res) {
        res.status(403).send(this.message);
    }

}

module.exports.FileDoesNotExist = class FileDoesNotExist extends Error {

    constructor() {
        super('Requested File Does Not Exist');
        this.code = 404;
    }

    run(res) {
        res.status(this.code).send(this.message);
    }

}