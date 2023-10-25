const db = require("../../utilities/db");
const sendError = require("../../utilities/sendError");
const { getWeekDays, separateAreas } = require("../utilities");
const { createProductivityWeek, createSingleProductivity } = require("../controllers/Productivity");

const querys = [
    `SELECT employees.Name as employee, incidences.Code as incidence, assistance.Date, areas.Name as area, positions.Name as position
    FROM assistance
    JOIN incidences ON incidences.Id = assistance.IncidenceId 
    JOIN areas ON areas.Id = assistance.AreaId 
    JOIN positions ON positions.Id = assistance.PositionId 
    JOIN employees ON assistance.EmployeeId = employees.Id 
    where assistance.Date = ?`,

    `select 
    Id,
	(select Name from employees where employees.Id = assistance.EmployeeId) as Nombre,
	(select Name from areas where areas.Id = assistance.AreaId) as Area,
    (select Name from positions where positions.Id = assistance.PositionId) as Puesto,
    (select Code from incidences where incidences.Id = assistance.IncidenceId0) as Lunes,
	(select Code from incidences where incidences.Id = assistance.IncidenceId1) as Martes,
	(select Code from incidences where incidences.Id = assistance.IncidenceId2) as Miercoles,
	(select Code from incidences where incidences.Id = assistance.IncidenceId3) as Jueves,
	(select Code from incidences where incidences.Id = assistance.IncidenceId4) as Viernes
	from assistance where date = ?`,

    `INSERT INTO assistance (EmployeeId, AreaId, PositionId, Date, incidenceId0, incidenceId1, incidenceId2, incidenceId3, incidenceId4)
    SELECT Id, AreaId, PositionId, ?, 1,1,1,1,1 FROM employees where active = 1; `,

    `update assistance set 
    IncidenceId0 = (Select Id from incidences where Code = ?),
    IncidenceId1 = (Select Id from incidences where Code = ?),
    IncidenceId2 = (Select Id from incidences where Code = ?),
    IncidenceId3 = (Select Id from incidences where Code = ?),
    IncidenceId4 = (Select Id from incidences where Code = ?)
    where Id = ?
    `,

    `select 
    Id,
	(select Name from employees where employees.Id = assistance.EmployeeId) as Nombre,
	(select Name from areas where areas.Id = assistance.AreaId) as Area,
    (select Name from positions where positions.Id = assistance.PositionId) as Puesto,
    (select Code from incidences where incidences.Id = assistance.IncidenceId0) as Lunes,
	(select Code from incidences where incidences.Id = assistance.IncidenceId1) as Martes,
	(select Code from incidences where incidences.Id = assistance.IncidenceId2) as Miercoles,
	(select Code from incidences where incidences.Id = assistance.IncidenceId3) as Jueves,
	(select Code from incidences where incidences.Id = assistance.IncidenceId4) as Viernes
	from assistance where Id = ?`,

    `INSERT INTO assistance (EmployeeId, AreaId, PositionId, Date, incidenceId0, incidenceId1, incidenceId2, incidenceId3, incidenceId4)
    SELECT Id, AreaId, PositionId, ?, 1,1,1,1,1 FROM employees where id = ?; `,
];

const getdayAssistance = async (req, res) => {
    db.query(querys[0], [req.body.Date], async (err, rows) => {
        if (err) return sendError(res, err);

        res.send(rows);
    });
};

const getWeekAssistance = async (req, res) => {
    const [firstDate, secondDate] = getWeekDays(req.body.Date);

    db.query(querys[1], [firstDate], async (err, rows) => {
        if (err) return sendError(res, err);

        res.send(separateAreas(rows));
    });
};

const createAssistanceWeek = async (req, res) => {
    let error;
    const [firstDate, secondDate] = getWeekDays(req.body.Date);
    db.query("select Id from assistance where Date = ? ", [firstDate], async (err, rows) => {
        if (rows.length > 0) return res.send("ya existen datos");

        db.query(querys[2], [firstDate], async (err, rows) => {
            if (err) return (error = err);

            createProductivityWeek(req, res);
        });
    });
};

const changeEmployeAssistance = async (req, res) => {
    db.query(querys[3], [req.body.Lunes, req.body.Martes, req.body.Miercoles, req.body.Jueves, req.body.Viernes, req.body.Id], async (err, rows) => {
        if (err) return sendError(res, err, rows);

        db.query(querys[4], [req.body.Id], async (err, rows) => {
            res.send(rows);
        });
    });
};

const createSingleAssitance = async (req, res) => {
    const [firstDate, secondDate] = getWeekDays(req.body.AdmissionDate);

    console.log(req.body.EmployeeId);
    db.query(querys[5], [firstDate, req.body.EmployeeId], async (err, rows) => {
        if (err) return sendError(res, err);

        req.body.AssistanceId = rows.insertId;
        createSingleProductivity(req, res);
    });
};

const getEmployeAssistance = async (req, res) => {
    db.query(querys[4], [req.body.Id], async (err, rows) => {
        res.send(rows);
    });
};

module.exports = {
    getdayAssistance,
    getWeekAssistance,
    getEmployeAssistance,
    createAssistanceWeek,
    changeEmployeAssistance,
    createSingleAssitance,
};
