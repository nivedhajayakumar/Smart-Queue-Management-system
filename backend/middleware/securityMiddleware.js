const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        message: "Too many requests, please try again later"
    }
});

function applySecurityMiddleware(app) {
    app.use(helmet());
    app.use(apiLimiter);

    if (process.env.NODE_ENV !== "test") {
        app.use(morgan("dev"));
    }
}

module.exports = applySecurityMiddleware;
