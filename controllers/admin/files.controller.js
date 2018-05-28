const { RequireFilter } = require('../../filters');
const { Files } = require('../../db/models');
const Promise = require('bluebird');

const requireFields = {
    Post: ['email', 'role', 'fname', 'lname'],
    Het: ['id'],
    List: ['page', 'rowsPerPage']
}

module.exports = class {

    /**
     * Function will return all files with paggination
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    static List(req, res, next) {
        const { descending, sortBy } = req.query;

        return RequireFilter
            .Check(req.query, requireFields.List)
            .then(validated => new Files()
                .orderBy(sortBy ? sortBy : 'created_at', descending === 'true' || !descending ? 'DESC' : 'ASC')
                .fetchPage({
                    workspace_id: req.workspace.id,
                    pageSize: validated.rowsPerPage, // Defaults to 10 if not specified
                    page: validated.page, // Defaults to 1 if not specified
                    withRelated: ['file', 'user', 'user.profile']
                }))
            .then(result => res.status(200).send({
                items: result.toJSON(),
                pagination: result.pagination
            }))
            .catch(next)
    }

    /**
     * get current File
     * @param {*} req 
     * @param {*} res 
     */
    static Get(req, res, next) {
        return req.requestedUser
            .refresh({
                withRelated: ['profile', 'profile.avatar']
            })
            .then(user => res.status(200).send(user))
            .catch(next);
    }

    /**
     * Update current File
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    static Put(req, res, next) {

    }

    /**
     * Delete Current File
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    static Delete(req, res, next) {

    }


}