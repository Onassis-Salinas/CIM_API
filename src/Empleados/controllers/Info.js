const db = require("../../utilities/db");
const sql = require("../../utilities/db2");
const sendError = require("../../utilities/sendError");
const { getWeekDays, getDayNumber } = require("../utilities");

const getWeeklyFires = async (req, res) => {
    const [firstDate, secondDate] = getWeekDays(req.body.Date);

    db.query("SELECT COUNT(*) as count FROM assistance where Date = ? and 6 IN (incidenceId0, incidenceId1, incidenceId2, incidenceId3, incidenceId4)", [firstDate], async (err, rows, fields) => {
        if (err) return sendError(res, err);

        res.send(rows);
    });
};

const getWeeklyHires = async (req, res) => {
    const [firstDate, secondDate] = getWeekDays(req.body.Date);
    db.query("SELECT COUNT(*) as count FROM employees where admissionDate >= ? and admissionDate <= ?", [firstDate, secondDate], async (err, rows, fields) => {
        if (err) return sendError(res, err);

        res.send(rows);
    });
};

const getDailyIncidence = async (req, res) => {
    const [firstDate, secondDate] = getWeekDfays(req.body.Date);
    let dayNumber = getDayNumber(req.body.Date);

    db.query("SELECT COUNT(*) as count FROM assistance where Date = ? and incidenceId? = (select id from incidences where code = ?)", [firstDate, dayNumber, req.body.Code], async (err, rows, fields) => {
        if (err) return sendError(res, err);

        res.send(rows);
    });
};

const getActiveemployees = async (req, res) => {
    db.query("SELECT COUNT(*) as count FROM employees where Active = 1", async (err, rows, fields) => {
        if (err) return sendError(res, err);

        res.send(rows);
    });
};

const getAssistanceInfo = async (req, res) => {
    const [firstDate, secondDate] = getWeekDays(req.body.Date);
    let dayNumber = getDayNumber(req.body.Date);

    db.query("SELECT (select name from incidences where id = incidenceid?) as incidence, COUNT(*) as quantity FROM assistance WHERE date = ? GROUP BY incidenceid?;", [dayNumber, firstDate, dayNumber], async (err, rows, fields) => {
        if (err) return sendError(res, err);

        res.send(rows);
    });
};
const getAreaAssistanceInfo = async (req, res) => {
    const [firstDate, secondDate] = getWeekDays(req.body.Date);
    let dayNumber = getDayNumber(req.body.Date);

    db.query("SELECT (select name from incidences where id = incidenceid?) as incidence, COUNT(*) as quantity FROM assistance WHERE date = ? and employeeId in (select id from employees where areaId = (select id from areas where Name = ?)) GROUP BY incidenceid?", [dayNumber, firstDate, req.body.Area, dayNumber], async (err, rows, fields) => {
        if (err) return sendError(res, err);

        res.send(rows);
    });
};

const getemployeeTemplate = async (req, res) => {
    try {
        const [rows] = await sql.query("SELECT value from general where Name = 'Plantilla'");
        res.send(rows);
    } catch (err) {
        return sendError(err);
    }
};

const getEmployeeRotation = async (req, res) => {
    const [firstDate, secondDate] = getWeekDays(req.body.Date);
    const dayMiliSeconds = 24 * 60 * 60 * 1000;

    const initialDate = new Date(new Date(firstDate).getTime() - 28 * dayMiliSeconds).toISOString().split("T")[0];
    const finalDate = new Date(new Date(secondDate).getTime() - 7 * dayMiliSeconds).toISOString().split("T")[0];

    let fires = 0;
    let hires = 0;
    let initalEmployees = 0;
    let finalEmployees = 0;

    db.query("Select COUNT(*) as count from employees where quitDate >= ? and quitDate <= ? ", [initialDate, finalDate], async (err, rows, fields) => {
        if (err) return sendError(res, err);
        fires = rows[0].count;

        db.query("Select COUNT(*) as count from employees where admissionDate >= ? and quitDate <= ? ", [initialDate, finalDate], async (err, rows, fields) => {
            if (err) return sendError(res, err);
            hires = rows[0].count;

            db.query("SELECT COUNT(*) as count FROM employees where Active = 1", async (err, rows, fields) => {
                if (err) return sendError(res, err);

                finalEmployees = rows[0].count;
                initalEmployees = finalEmployees + fires - hires;

                const result = ((fires + hires) / 2 / ((initalEmployees + finalEmployees) / 2)) * 100;
                res.send({ result: result });
            });
        });
    });
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
