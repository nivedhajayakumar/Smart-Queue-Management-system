function notFound(req, res, next) {
    res.status(404);
    next(new Error(`Route not found: ${req.originalUrl}`));
}

function errorHandler(error, req, res, next) {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    res.status(statusCode).json({
        message: error.message,
        stack: process.env.NODE_ENV === "production" ? null : error.stack
    });
}

module.exports = {
    notFound,
    errorHandler
};
