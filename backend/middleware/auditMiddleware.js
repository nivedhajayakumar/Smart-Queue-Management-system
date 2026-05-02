const { writeAuditLog } = require("../services/auditService");

function auditMiddleware(req, res, next) {
    res.on("finish", () => {
        if (["POST", "PATCH", "PUT", "DELETE"].includes(req.method)) {
            writeAuditLog({
                user: req.user ? req.user.id : null,
                role: req.user ? req.user.role : null,
                action: `${req.method} ${req.originalUrl}`,
                method: req.method,
                path: req.originalUrl,
                ipAddress: req.ip,
                statusCode: res.statusCode
            });
        }
    });

    next();
}

module.exports = auditMiddleware;
