const db = require("../../utilities/db");
const sql = require("../../utilities/db2");
const sendError = require("../../utilities/sendError");
const { getWeekDays, getDayNumber } = require("../../utilities/functions");

const getWeeklyFires = async (req, res) => {
    const [firstDate] = getWeekDays(req.body.Date);

    try {
        const [rows] = await sql.query("SELECT COUNT(*) as count FROM assistance where Date = ? and 6 IN (incidenceId0, incidenceId1, incidenceId2, incidenceId3, incidenceId4)", [firstDate]);
        res.send(rows);
    } catch (err) {
        return sendError(res, 500, err, err);
    }
};

const getWeeklyHires = async (req, res) => {
    const [firstDate, secondDate] = getWeekDays(req.body.Date);

    try {
        const [rows] = await sql.query("SELECT COUNT(*) as count FROM employees where admissionDate >= ? and admissionDate <= ?", [firstDate, secondDate]);
        res.send(rows);
    } catch (err) {
        return sendError(res, 500, err);
    }
};

const getDailyIncidence = async (req, res) => {
    const [firstDate] = getWeekDfays(req.body.Date);
    let dayNumber = getDayNumber(req.body.Date);

    try {
        const [rows] = await sql.query("SELECT COUNT(*) as count FROM assistance where Date = ? and incidenceId? = (select id from incidences where code = ?)", [firstDate, dayNumber, req.body.Code]);
        res.send(rows);
    } catch (err) {
        return sendError(res, 500, err);
    }
};

const getActiveemployees = async (req, res) => {
    try {
        const [rows] = await sql.query("SELECT COUNT(*) as count FROM employees where Active = 1");
        res.send(rows);
    } catch (err) {
        return sendError(res, 500, err);
    }
};

const getAssistanceInfo = async (req, res) => {
    const [firstDate] = getWeekDays(req.body.Date);
    let dayNumber = getDayNumber(req.body.Date);

    try {
        const [rows] = await sql.query("SELECT (select name from incidences where id = incidenceid?) as incidence, COUNT(*) as quantity FROM assistance WHERE date = ? GROUP BY incidenceid?;", [dayNumber, firstDate, dayNumber]);
        res.send(rows);
    } catch (err) {
        return sendError(res, 500, err);
    }
};

const getAreaAssistanceInfo = async (req, res) => {
    const [firstDate] = getWeekDays(req.body.Date);
    let dayNumber = getDayNumber(req.body.Date);

    try {
        const [rows] = await sql.query("SELECT (select name from incidences where id = incidenceid?) as incidence, COUNT(*) as quantity FROM assistance WHERE date = ? and employeeId in (select id from employees where areaId = (select id from areas where Name = ?)) GROUP BY incidenceid?", [dayNumber, firstDate, req.body.Area, dayNumber]);
        res.send(rows);
    } catch (err) {
        return sendError(res, 500, err);
    }
};

const getemployeeTemplate = async (req, res) => {
    try {
        const [rows] = await sql.query("SELECT value from general where Name = 'Plantilla'");
        res.send(rows);
    } catch (err) {
        return sendError(res, 500, err);
    }
};

const getEmployeeRotation = async (req, res) => {
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

module.exports = {
    getWeeklyFires,
    getWeeklyHires,
    getDailyIncidence,
    getActiveemployees,
    getAssistanceInfo,
    getEmployeeRotation,
    getemployeeTemplate,
    getAreaAssistanceInfo,
};
