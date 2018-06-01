const AWS = require('aws-sdk');
const config = require('config');
const Promise = require('bluebird')

// Bucket names must be unique across all S3 users

class S3Service {

  constructor() {
    this.s3 = new AWS.S3({
      accessKeyId: config.get('AWS.S3.accessKeyId'),
      secretAccessKey: config.get('AWS.S3.secretAccessKey'),
      params: { Bucket: config.get('AWS.S3.bucket') }
    });
  }

	/**
	 * Params Object like for amazon S3 method
	 * @param {*} params 
	 */
  put(params) {
    return Promise.fromCallback(cb => this.s3.putObject(params, cb))
  }

	/**
	 * Params Object like for amazon S3 method
	 * @param {*} params 
	 */
  get(params) {
    return Promise.fromCallback(cb => this.s3.getObject(params, cb))
  }

  getFile(params) {
    return Promise.fromCallback(cb => this.s3.getSignedUrl('getObject', params, cb))
  }


}



module.exports = new S3Service();