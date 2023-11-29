const validatePermission = (permissionRequired, rw) => (req, res, next) => {
    const permissionLevel = getPermissionLevel(req.user["Perm_" + permissionRequired]);
    const requiredPermissionLevel = getPermissionLevel(rw);

    if (permissionLevel < requiredPermissionLevel) return res.status(401).send("No estas autorizado");
    next();
};

const getPermissionLevel = (permission) => {
    if (permission === "r") {
        return 1;
    } else if (permission === "w") {
        return 2;
    } else {
        return 0;
    }
};

module.exports = validatePermission;
