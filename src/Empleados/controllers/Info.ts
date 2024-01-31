import sql from "../../utilities/db2";
import sendError from "../../utilities/sendError";
import { getWeekDays, getDayNumber } from "../../utilities/functions";
import { Response, Request } from "express";

export const getWeeklyFires = async (req: Request, res: Response) => {
    const [firstDate] = getWeekDays(req.body.Date);

    try {
        const [rows] = await sql.query("SELECT COUNT(*) as count FROM assistance where Date = ? and 6 IN (incidenceId0, incidenceId1, incidenceId2, incidenceId3, incidenceId4)", [firstDate]);
        res.send(rows);
    } catch (err) {
        return sendError(res, 500, err);
    }
};

export const getWeeklyHires = async (req: Request, res: Response) => {
    const [firstDate, secondDate] = getWeekDays(req.body.Date);

    try {
        const [rows] = await sql.query("SELECT COUNT(*) as count FROM employees where admissionDate >= ? and admissionDate <= ?", [firstDate, secondDate]);
        res.send(rows);
    } catch (err) {
        return sendError(res, 500, err);
    }
};

export const getDailyIncidence = async (req: Request, res: Response) => {
    const [firstDate] = getWeekDays(req.body.Date);
    let dayNumber = getDayNumber(req.body.Date);

    try {
        const [rows] = await sql.query("SELECT COUNT(*) as count FROM assistance where Date = ? and incidenceId? = (select id from incidences where code = ?)", [firstDate, dayNumber, req.body.Code]);
        res.send(rows);
    } catch (err) {
        return sendError(res, 500, err);
    }
};

export const getActiveemployees = async (req: Request, res: Response) => {
    try {
        const [rows] = await sql.query("SELECT COUNT(*) as count FROM employees where Active = 1");
        res.send(rows);
    } catch (err) {
        return sendError(res, 500, err);
    }
};

export const getAssistanceInfo = async (req: Request, res: Response) => {
    const [firstDate] = getWeekDays(req.body.Date);
    let dayNumber = getDayNumber(req.body.Date);

    try {
        const [rows] = await sql.query("SELECT (select name from incidences where id = incidenceid?) as incidence, COUNT(*) as quantity FROM assistance WHERE date = ? GROUP BY incidenceid?;", [dayNumber, firstDate, dayNumber]);
        res.send(rows);
    } catch (err) {
        return sendError(res, 500, err);
    }
};

export const getAreaAssistanceInfo = async (req: Request, res: Response) => {
    const [firstDate] = getWeekDays(req.body.Date);
    let dayNumber = getDayNumber(req.body.Date);

    try {
        const [rows] = await sql.query("SELECT (select name from incidences where id = incidenceid?) as incidence, COUNT(*) as quantity FROM assistance WHERE date = ? and employeeId in (select id from employees where areaId = (select id from areas where Name = ?)) GROUP BY incidenceid?", [
            dayNumber,
            firstDate,
            req.body.Area,
            dayNumber,
        ]);
        res.send(rows);
    } catch (err) {
        return sendError(res, 500, err);
    }
};

export const getemployeeTemplate = async (req: Request, res: Response) => {
    try {
        const [rows] = await sql.query("SELECT value from general where Name = 'Plantilla'");
        res.send(rows);
    } catch (err) {
        return sendError(res, 500, err);
    }
};

export const getEmployeeRotation = async (req: Request, res: Response) => {
    const [firstDate, secondDate] = getWeekDays(req.body.Date);
    const dayMiliSeconds = 24 * 60 * 60 * 1000;

    const initialDate = new Date(new Date(firstDate).getTime() - 28 * dayMiliSeconds).toISOString().split("T")[0];
    const finalDate = new Date(new Date(secondDate).getTime() - 7 * dayMiliSeconds).toISOString().split("T")[0];

    let rows;

    try {
        [rows] = await sql.query("Select COUNT(*) as count from employees where quitDate >= ? and quitDate <= ? ", [initialDate, finalDate]);
        const fires = rows[0].count;

        [rows] = rows[0].count[rows] = await sql.query("Select COUNT(*) as count from employees where admissionDate >= ? and quitDate <= ? ", [initialDate, finalDate]);
        const hires = rows[0].count;

        [rows] = await sql.query("SELECT COUNT(*) as count FROM employees where Active = 1");
        const finalEmployees = rows[0].count;
        const initalEmployees = finalEmployees + fires - hires;

        const result = ((fires + hires) / 2 / ((initalEmployees + finalEmployees) / 2)) * 100;
        res.send({ result: result });
    } catch (err) {
        return sendError(res, 500, err);
    }
};
