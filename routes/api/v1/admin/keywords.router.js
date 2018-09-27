const Router = require('express').Router;
const { AdminController } = require('../../../../controllers');
const { Keywords } = require('../../../../db/models');
const { ValidationMiddleware } = require('../../../../middleware');


const KeywordsRouter = Router();


KeywordsRouter
    .get(
        '/',
        ValidationMiddleware(AdminController.Keywords.Schema.List),
        AdminController.Keywords.List
    )
    .post(
        '/',
        ValidationMiddleware(AdminController.Keywords.Schema.Create),
        AdminController.Keywords.Post
    )
    .param(
        'keyword_id',
        function (req, res, next, keyword_id) {
            return new Keywords({ id: keyword_id })
                .fetch({ require: true })
                .then(requestedKeyword => req.requestedKeyword = requestedKeyword)
                .then(() => next())
                .catch(next);
        }
    )
    .put(
        '/:keyword_id',
        AdminController.Keywords.Put
    )
    .get(
        '/:keyword_id',
        AdminController.Keywords.Get
    );




module.exports = { KeywordsRouter };