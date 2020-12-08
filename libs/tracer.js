const tracer = require('ls-trace').init(
    {
        experimental: {
            b3: true
        }
    }
);

module.exports = tracer;
