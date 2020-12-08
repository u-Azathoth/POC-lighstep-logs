require('dotenv').config();
require('./libs/tracer')

const lighstep = require('./libs/lightstep');

lighstep.start().then(() => {
    const express = require('express');
    const app = express()
    const { logger, getRequestDetails } = require('./libs/logger')

    // All of your application code and any imports that should leverage
    // OpenTelemetry automatic instrumentation must go here; e.g.,
    // const express = require('express');

    // If you're using an automatically instrumented library (such as Express,
    // as above), spans will be created automatically.  If you would like to manually
    // create a span, uncomment the lines below:
    // const tracer = opentelemetry.trace.getTracer('example');
    // const span = tracer.startSpan('test-span');
    // span.end();
    // tracer.getActiveSpanProcessor().shutdown();

    app.get('/', (req, res) => {
        logger.info({ httpRequest: getRequestDetails(req, res) }, req.path);

        res.send('OK')
    });

    app.listen(8000, () => logger.info('Server is starting...'))
});


