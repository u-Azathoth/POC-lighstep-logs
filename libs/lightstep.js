const { lightstep } = require('lightstep-opentelemetry-launcher-node');

const sdk = lightstep.configureOpenTelemetry({
    accessToken: process.env.LS_ACCESS_TOKEN,
    serviceName: 'poc_lighstep_logs',
});

module.exports = sdk;
