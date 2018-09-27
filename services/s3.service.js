const AWS = require('aws-sdk');
const config = require('config');
const Promise = require('bluebird')

// Bucket names must be unique across all S3 users

class S3Service {

  constructor() {
    this.s3 = new AWS.S3({
      accessKeyId: process.env.BUCKETEER_AWS_ACCESS_KEY_ID || config.get('AWS.S3.accessKeyId'),
      secretAccessKey: process.env.BUCKETEER_AWS_SECRET_ACCESS_KEY || config.get('AWS.S3.secretAccessKey'),
      params: { Bucket: process.env.BUCKETEER_BUCKET_NAME || config.get('AWS.S3.bucket') }
    });
  }

	/**
	 * Params Object like for amazon S3 method
	 * @param {*} params 
	 */
  put(params) {
    return Promise.fromCallback(cb => this.s3.putObject(params, cb));
  }

	/**
	 * Params Object like for amazon S3 method
	 * @param {*} params 
	 */
  get(params) {
    return Promise.fromCallback(cb => this.s3.getObject(params, cb));
  }

  delete(params) {
    return Promise.fromCallback(cb => this.s3.deleteObject(params, cb));
  }

  getSignedUrl(params) {
    return Promise.fromCallback(cb => this.s3.getSignedUrl('getObject', params, cb))
  }

}



module.exports = new S3Service();