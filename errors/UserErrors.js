module.exports.EmailExist = class EmailExist extends Error {
    
        constructor(code, message) {
            message = message ? message : 'User with the same email already exist';
            super(message);
            this.code = code ? code : 409;
        }
    
        run(res) {
            res.status(this.code).send(this.message);
        }
    
    }