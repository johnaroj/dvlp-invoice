"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../constants/index");
const ROLES = {
    User: index_1.USER,
    Admin: index_1.ADMIN,
};
const checkRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user && !req.roles) {
            res.status(401);
            throw new Error("Unauthorized");
        }
        const rolesArray = [...allowedRoles];
        const roleFound = req.roles
            .map((role) => rolesArray.includes(role))
            .find((val) => val === true);
        if (!roleFound) {
            res.status(403);
            throw new Error("Forbidden");
        }
        next();
    };
};
const role = { ROLES, checkRole };
exports.default = role;
//# sourceMappingURL=roleMiddleware.js.map