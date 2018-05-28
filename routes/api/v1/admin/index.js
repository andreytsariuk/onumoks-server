
const { InvitesRouter } = require('./invites.router');
const { UsersRouter } = require('./users.router');
const { FilesRouter } = require('./files.router');
const { CoursesRouter } = require('./courses.router');
const { StudentRouter } = require('./students.router');
const { SpecialtyRouter } = require('./specialties.router');
const { LectorsRouter } = require('./lectors.router');
const { PositionsRouter } = require('./positions.router');
const { SubjectRouter } = require('./subjects.router');
const { LessonTypeRouter } = require('./lessonTypes.router');
const { GroupRouter } = require('./groups.router');
const { ThreadRouter } = require('./threads.router');




const AdminRouter = require('express').Router();


/**Paths */

AdminRouter.use('/invites', InvitesRouter);
AdminRouter.use('/users', UsersRouter);
AdminRouter.use('/files', FilesRouter);
AdminRouter.use('/students', StudentRouter);
AdminRouter.use('/specialties', SpecialtyRouter);
AdminRouter.use('/lectors', LectorsRouter);
AdminRouter.use('/courses', CoursesRouter);
AdminRouter.use('/positions', PositionsRouter);
AdminRouter.use('/subjects', SubjectRouter);
AdminRouter.use('/lesson-types', LessonTypeRouter);
AdminRouter.use('/groups', GroupRouter);
AdminRouter.use('/threads', ThreadRouter);











module.exports = AdminRouter;
