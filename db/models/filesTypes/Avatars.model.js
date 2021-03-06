
const Bookshelf = require('../../../config/bookshelf');
const knex = Bookshelf.knex;
const Promise = require('bluebird');
const Profiles = require('../Profiles.model');
const Files = require('../Files.model');
const config = require('config');
const { S3Service } = require('../../../services');

module.exports = Bookshelf.model('Avatars', Bookshelf.Model.extend({
    tableName: 'avatars',
    initialize: function () {
        this.on('creating', this.beforeSave);
    },
    afterCreate: function () {
        return new Files({
            file_type: 'avatars',
            file_id: this.attributes.id
        }).save()
    },
    beforeSave: function () {

        this.attributes.code;
        return this;
    },
    files() {
        return this.morphOne('Files', 'file');
    },
    path: function () {
        return (`${process.cwd()}/images/avatars/${this.get('name')}`);
    },
    virtuals: {
        publicPath: function () {
            if (this.get('name')) {
                let ret;
                S3Service.getSignedUrl({
                    Key: this.get('name'),
                    Bucket: config.get('AWS.S3.bucket')
                })
                    .then(res => ret = res)
                    .catch(err => ret = 'foo')
                while (ret === undefined) {
                    require('deasync').sleep(50);
                }
                return ret;
            }
            else
                return undefined;

            // if (this.get('name'))
            //     return (`${config.get('Server.Url')}/images/avatars/${this.get('name')}`);
            // else
            //     return undefined;
        }
    }
}));
