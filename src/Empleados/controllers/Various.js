const db = require("../../utilities/db");
const sendError = require("../../utilities/sendError");
const { getWeekDays } = require("../utilities");

const getPositions = async (req, res) => {
    db.query("select Name from positions", async (err, rows, fields) => {
        if (err) return sendError(res, err);

        res.send(rows);
    });
};

const getAreas = async (req, res) => {
    db.query("Select Name from areas", async (err, rows, fields) => {
        if (err) return sendError(res, err);

        res.send(rows);
    });
};

const getCapturedAreas = async (req, res) => {
    db.query("Select Name from areas where id In (2, 5, 6, 7, 8, 9, 10, 11, 12)", async (err, rows, fields) => {
        if (err) return sendError(res, err);

        res.send(rows);
    });
};
const getEmployeesByArea = async (req, res) => {
    db.query("Select Name from employees where areaId = (select areaId from areas where Name = ?)", async (err, rows, fields) => {
        if (err) return sendError(res, err);

        res.send(rows);
    });
};
const getProductivityEmployeesByArea = async (req, res) => {
    if(!req.body.Date) return
    const [firstDate, secondDate] = getWeekDays(req.body.Date);

    db.query("select Name from employees where id in (select employeeId from assistance where areaId = (select Id from areas where name = ?) and date = ?)", [req.body.Area, firstDate], async (err, rows, fields) => {
        if (err) return sendError(res, err);

        res.send(rows);
    });
};

//make a new function

module.exports = {
    getPositions,
    getAreas,
    getCapturedAreas,
    getEmployeesByArea,
    getProductivityEmployeesByArea,
};
