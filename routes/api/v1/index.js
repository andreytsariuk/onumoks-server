const { UsersRouter } = require('./users');
// const SubjectRouter = require('./subjects.router');
// const SpecialtiesRouter = require('./specialties.router');
// const CoursesRouter = require('./courses.router');

const AdminRouter = require('./admin')

// const MessageRouter = require('./messages.router');

const { AuthorizeMidddleweare } = require('../../../middleware');

/* API */

let ApiRouter = require('express').Router();

/**Midddlewears */
ApiRouter.use(AuthorizeMidddleweare);

/**Paths */
// ApiRouter.use('/messages', MessageRouter);
ApiRouter.use('/users', UsersRouter);
ApiRouter.use('/admin', AdminRouter);

// ApiRouter.use('/subjects', SubjectRouter);
// ApiRouter.use('/specialties', SpecialtiesRouter);
// ApiRouter.use('/courses', CoursesRouter);



module.exports = ApiRouter;
