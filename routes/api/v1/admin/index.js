
const { InvitesRouter } = require('./invites.router');
const { UsersRouter } = require('./users.router');
const { FilesRouter } = require('./files.router');
const { CoursesRouter } = require('./courses.router');
const { StudentRouter } = require('./students.router');
const { SpecialtyRouter } = require('./specialties.router');


const AdminRouter = require('express').Router();


/**Paths */

AdminRouter.use('/invites', InvitesRouter);
AdminRouter.use('/users', UsersRouter);
AdminRouter.use('/files', FilesRouter);
AdminRouter.use('/students', StudentRouter);
AdminRouter.use('/specialties', SpecialtyRouter);
AdminRouter.use('/courses', CoursesRouter);






module.exports = AdminRouter;
