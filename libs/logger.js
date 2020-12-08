const { LoggingBunyan } = require('@google-cloud/logging-bunyan')
const bunyan = require('bunyan')
const { get } = require('lodash')

/*
 * Log types labels
 *
 * It helps to categorize all logs by their types (e.g. "application"/"pubsub"/
 * "database" events.) and search by them in Logs Viewer
 *
 * This code uses Proxy API to simplify usage
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy
 * This allows us to do such a transformation
 * logTypes.SYSTEM_EVENT => { labels: { type: 'System Event' } }
 *
 * @example <caption>The basic usage</caption>
 * logger.info(logTypes.SYSTEM_EVENT, 'msg'})
 *
 * @example <caption>Usage with other params</caption>
 * logger.info({...logTypes.SYSTEM_EVENT, id: 1 }, 'msg'})
 *
 * */
const eventTypes = { SYSTEM_EVENT: 'System Event', REQUEST_INFO: 'Request Info' }
const logTypes = new Proxy(eventTypes, {
    get(target, name, receiver) {
        return { labels: { type:  Reflect.get(target, name, receiver) } }
    }
});

/*
 * Format details of a http request. For correct displaying in Stackdriver it
 * shall be wrapped in "httpRequest" property.
 *
 * @example <caption>The basic usage</caption>
 * logger.info({ httpRequest: getRequestDetails(req, res) }, 'msg')
 * */
const getRequestDetails = (req = {}, res = {}) => ({
    status: res.statusCode,
    requestUrl: req.url,
    requestMethod: req.method,
    remoteIp: get(req, 'connection.remoteAddress'),
    queryParams: req.query
})

const logLevel = process.env.LOG_LEVEL || 'info' // TODO: use .env variable for that;

/*
 * Logger implementation
 * The default instance of the logger, which uses @google-cloud/logging-bunyan package to
 * attach Stackdriver Logging stream to Bunyan
 *
 * @google-cloud/logging-bunyan requires GCP Project ID for gax auth package.
 * If Project ID is not explicitly specified in the config params, the package will read it
 * from env variable GOOGLE_APPLICATION_CREDENTIALS
 *
 * @example <caption>Import the client library</caption>
 * const { logger } = require('kwcon-common/class/libs');
 *
 * @example <caption>The basic usage of the logger, will write a info log</caption>
 * logger.info('One line log message')
 *
 * @example <caption>Write logs with params</caption>
 * logger.info({ userId: this.userId, env: process.env }, 'msg')
 * */
const logger = bunyan.createLogger({
    name: 'Stackdriver Logger',
    streams: [
        { stream: process.stdout, level: logLevel },
        // new LoggingBunyan({ projectId: 'poc_lighstep_logs' }).stream(logLevel)
    ]
})

module.exports = { logTypes, getRequestDetails, logger }
