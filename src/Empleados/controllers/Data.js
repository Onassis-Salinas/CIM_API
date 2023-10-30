const db = require("../../utilities/db");
const sendError = require("../../utilities/sendError");
const { createSingleAssitance } = require("../controllers/Assistance");
const { getWeekDays } = require("../utilities");

const querys = [
    `select Id, Name as Nombre, (Select Name from positions where positions.Id =employees.PositionId) as Posicion, NoEmpleado as 'No. Empleado', (Select Name from areas where areas.Id =employees.AreaId) as Area  , NSS, CURP, RFC, Blood as Sangre, Account as Cuenta, EmmergencyContact as 'Contacto de emergencia', EmmergencyNumber as 'Numero de emergencia', AdmissionDate as 'Fecha de ingreso' from employees where Active = 1`,

    `insert into employees 
     ( Account, Active, AdmissionDate, Blood, CURP, EmmergencyContact, EmmergencyNumber, NSS, Name, NoEmpleado, PositionId, RFC, AreaId ) 
     values ( ?, ?, ?, ?, ?,  ?, ?, ?,  ?, ?, (select Id from positions where Name = ?), ?, (select Id from areas where Name = ?))`,

    `update employees set
     NoEmpleado = ?, Name = ?, PositionId = (select id from  positions where Name = ?), AreaId = (select id from  areas where Name = ?), NSS = ?, CURP = ?, RFC = ?, Blood = ?, Account = ?, EmmergencyContact = ?, EmmergencyNumber = ?, AdmissionDate = ?
     where Id = ? `,

    `select Id, NoEmpleado as 'No. Empleado', Name as Nombre,(Select Name from positions where positions.Id =employees.PositionId) as Posicion,(Select Name from areas where areas.Id =employees.AreaId) as Area  , NSS, CURP, RFC, Blood as Sangre, Account as Cuenta, EmmergencyContact as 'Contacto de emergencia', EmmergencyNumber as 'Numero de emergencia', AdmissionDate as 'Fecha de ingreso' from employees where Id = ?`,
];

const getEmployeData = async (req, res) => {
    db.query(querys[0], [req.body.Material], async (err, rows, fields) => {
        if (err) return sendError(res, err);

        rows.forEach((row) => {
            row["Fecha de ingreso"] = row["Fecha de ingreso"].toISOString().split("T")[0];
        });

        res.send(rows);
    });
};

const addEmployee = async (req, res) => {
    db.query(querys[1], [req.body.Account, req.body.Active, req.body.AdmissionDate, req.body.Blood, req.body.CURP, req.body.EmmergencyContact, req.body.EmmergencyNumber, req.body.NSS, req.body.Name, req.body.NoEmpleado, req.body.Position, req.body.RFC, req.body.Area], async (err, rows, fields) => {
        if (err) return sendError(res, err);

        const [firstDate, secondDate] = getWeekDays(req.body.AdmissionDate);
        req.body.EmployeeId = rows.insertId;
        db.query("select Id from assistance where Date = ?", [firstDate], async (err, rows, fields) => {
            if (rows.length === 0) return res.send("completed");
            createSingleAssitance(req, res);
        });
    });
};

const updateEmployee = async (req, res) => {
    db.query(querys[2], [req.body["No. Empleado"], req.body.Nombre, req.body.Posicion, req.body.Area, req.body.NSS, req.body.CURP, req.body.RFC, req.body.Sangre, req.body.Cuenta, req.body["Contacto de emergencia"], req.body["Numero de emergencia"], req.body["Fecha de ingreso"], req.body.Id], async (err, rows) => {
        if (err) return sendError(res, err);

        db.query(querys[3], [req.body.Id], async (err, rows) => {
            if (err) return sendError(res, err);

            rows.forEach((row) => {
                row["Fecha de ingreso"] = row["Fecha de ingreso"].toISOString().split("T")[0];
            });

            res.send(rows);
        });
    });
};

const quitEmployee = async (req, res) => {
    const [firstDate, secondDate] = getWeekDays(req.body.Date);

    db.query("update employees set Active = 0, QuitDate = ? where Id = ?", [secondDate, req.body.EmployeeId], async (err, rows) => {
        if (err) return sendError(res, err);

        res.send("Completed")
    });
};

module.exports = {
    getEmployeData,
    addEmployee,
    updateEmployee,
    quitEmployee,
};
