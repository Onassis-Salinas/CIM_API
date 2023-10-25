const db = require("../../utilities/db");
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
    const [firstDate, secondDate] = getWeekDays(req.body.Date);
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

module.exports = {
    getWeeklyFires,
    getWeeklyHires,
    getDailyIncidence,
    getActiveemployees,
};
