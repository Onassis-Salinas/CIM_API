import db from "../../utilities/db";
import sendError from "../../utilities/sendError";
import { getWeekDays } from "../../utilities/functions";
import { Response, Request } from "express";
import sql from "../../utilities/db2";

interface CustomReq extends Request {
    user: string;
}

export const getPositions = async (req: Request, res: Response) => {
    db.query("select Name from positions", async (err: any, rows: any) => {
        if (err) return sendError(res, 500, err);

        res.send(rows);
    });
};

export const getAreas = async (req: Request, res: Response) => {
    db.query("Select Name from areas", async (err: any, rows: any) => {
        if (err) return sendError(res, 500, err);

        res.send(rows);
    });
};

export const getFilteredAreas = async (req: any, res: Response) => {
    if (!req.user.Perm_assistance_areas) return res.send([]);
    if (req.user.Perm_assistance_areas === "all") {
        const [result] = await sql.query("Select Name from areas");
        return res.send(result);
    }

    const areas = req.user.Perm_assistance_areas.split(",");
    const [result] = await sql.query("Select Name from areas where Name in (?)", [areas.slice(0, -1)]);

    res.send(result);
};

export const getCapturedAreas = async (req: Request, res: Response) => {
    db.query("Select Name from areas where id In (2, 5, 6, 7, 8, 9, 10, 11, 12)", async (err: any, rows: any) => {
        if (err) return sendError(res, 500, err);

        res.send(rows);
    });
};

export const getEmployeesByArea = async (req: Request, res: Response) => {
    db.query("Select Name from employees where areaId = (select areaId from areas where Name = ?)", async (err: any, rows: any) => {
        if (err) return sendError(res, 500, err);

        res.send(rows);
    });
};

export const getProductivityEmployeesByArea = async (req: Request, res: Response) => {
    if (!req.body.Date) return;
    const [firstDate] = getWeekDays(req.body.Date);

    db.query("select Name from employees where id in (select employeeId from assistance where areaId = (select Id from areas where name = ?) and date = ?)", [req.body.Area, firstDate], async (err: any, rows: any) => {
        if (err) return sendError(res, 500, err);

        res.send(rows);
    });
};

export const getIncidences = async (req: Request, res: Response) => {
    db.query("Select Code, Name from incidences", async (err: any, rows: any) => {
        if (err) return sendError(res, 500, err);

        res.send(rows);
    });
};
