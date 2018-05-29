module.exports = {
    AuthorizeMidddleweare: require('./authorize.middleware'),
    ErrorsMiddleweare: require('./errors.middleware'),
    AvatarUploadMiddleware: require('./avatar.middleware'),
    UserIdentityMiddleware: require('./userIdentity.middleware'),
    WorkspaceIdentityMiddleware: require('./workspaceIdentity.middleware'),
    ValidationMiddleware: require('./validation.middleware')
}