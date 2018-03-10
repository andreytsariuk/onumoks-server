const Promise = require('bluebird');
const config = require('config');
const handlebars = require('handlebars');
const fs = require('fs');
const { Emails } = require('../db/models')
const _ = require('lodash');
const nodemailer = require('nodemailer');
const moment = require('moment');
const sgTransport = require('nodemailer-sendgrid-transport');
const transporter = nodemailer.createTransport(sgTransport({
    auth: config.get('Emails.SendGrid')
}));




module.exports = class EmailService {



    static sendInvite(userName, token, email, workspace) {
        // The HTML body of the email.
        console.log('sdsssssss', `${config.get('Web.Url')}/invite?token=${token}`)
        return EmailService
            .readEmail('invite', {
                userName: userName ? userName : email,
                workspace: workspace.name,
                signUpUrl: `${config.get('Web.Url')}/${workspace.name}/sign-up/invite?token=${token}`,
                pathToWorkspace: '',
                serverUrl: config.get('Server.Url')
            })
            .then(body_html => ({
                from: workspace && workspace.settings && workspace.settings.email ? workspace.settings.email : config.get('Emails.Support'),
                to: email,
                subject: "inStudy User Invite",
                html: body_html
            })
            )
            .then(params => transporter.sendMail(params))
            .then(res => new Emails({
                workspace_id: workspace.id,
                type: config.get('EmailTypes.invite'),
                recipients: email
            }).save());
    }


	/**
	 * Function Only for reading Html From File
	 * @param {*} filename 
	 * @param {*} replacements 
	 */
    static readEmail(filename, replacements) {
        return Promise
            .fromCallback(callback => readHTMLFile(`${__dirname}/../views/emailTemplates/${filename}.html`, callback))
            .then(html => {
                let template = handlebars.compile(html);
                return template(replacements);
            });
    }
}







function readHTMLFile(path, callback) {
    fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
        if (err) {
            throw err;
            callback(err);
        }
        else {
            callback(null, html);
        }
    });
};