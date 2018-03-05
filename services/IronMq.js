
const iron_mq = require('iron_mq');
const { RequireFilter } = require('../filters');
const config = require('config');


const requireFields = {
    sendMessage: ['id']
}

module.exports = class {
    //, 'token'
    /**
     * 
     * @param {IronMq Token} token 
     * @param {IronMq project_id} project_id 
     * @param {IronMq queue_name} queue_name 
     */
    constructor(token, project_id, queue_name) {
        //=================Defaut==================
        token = token ? token : config.get("IronMQ.Token");
        project_id = project_id ? project_id : config.get("IronMQ.ProjectId");
        queue_name = queue_name ? queue_name : config.get("IronMQ.QueueName");
        //=================Defaut==================

        this.imq = new iron_mq.Client({
            token: token,
            project_id: project_id,
            queue_name: queue_name
        });
        // this.queue = imq.queue(config.get("IronMQ.QueueName"));
    }

    /**
     * 
     * @param {Object} message 
     */
    sendMessage(message) {
        console.log('Start send')
        return new Promise((resolve, reject) => {
            if (!RequireFilter.Check(message, requireFields.sendMessage))
                throw new Error('No nedded data');

            this.imq.post(JSON.stringify(message), (error, body) => {
                console.log('resssss', body)
                if (error)
                    reject(error);
                resolve(body);
            });
        });
    }


}