import sendError from "../utilities/sendError";
import { Response, Request, NextFunction } from "express";

interface CustomRequest extends Request {
    user?: any;
}

const validatePermission = (permissionRequired: any, rw: any) => (req: CustomRequest, res: Response, next: NextFunction) => {
    const permissionLevel = getPermissionLevel(req.user["Perm_" + permissionRequired]);
    const requiredPermissionLevel = getPermissionLevel(rw);

    if (permissionLevel < requiredPermissionLevel) return sendError(res, 403);
    next();
};

const getPermissionLevel = (permission: any) => {
    if (permission === "r") {
        return 1;
    } else if (permission === "w") {
        return 2;
    } else {
        return 0;
    }
};

export default validatePermission;
