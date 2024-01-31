import db from "../../utilities/db";
import sql from "../../utilities/db2";
import sendError from "../../utilities/sendError";
import { createSingleAssitance } from "./Assistance";
import { getWeekDays } from "../../utilities/functions";
import { Response, Request } from "express";

export const querys = [
    `select Id, CONCAT(Name, ' ', PaternalLastName, ' ', MaternalLastName) AS Nombre, (Select Name from positions where positions.Id =employees.PositionId) as Posicion, NoEmpleado as 'No. Empleado',
     (Select Name from areas where areas.Id =employees.AreaId) as Area  , NSS, CURP, RFC, Blood as Sangre, Account as Cuenta, EmmergencyContact as 'Contacto de emergencia',
     EmmergencyNumber as 'Numero de emergencia', AdmissionDate as 'Fecha de ingreso', 
     BornLocation as 'Lugar de nacimiento', Genre as Genero, Sons as Hijos, ClinicNo as 'Numero de clinica', Email, Number as 'Numero de telefono', Direction as Direccion,
     Bank as Banco, InfonavitNo as 'Numero de infonavit', InfonavitFee as 'Cuota fija de infonavit', InfonavitDiscount as 'Descuento de infonavit', PositionType as 'Tipo de posicion',
     HYR as 'Cambio de HYR', CIM as 'Cambio de CIM', Shift as Turno, NominaSalary as 'Salario de nomina', IMMSSalary as 'Salario integrado IMMS',

     (SELECT SUM(WithSalary) from vacationreq where EmployeeId = employees.Id) as 'vacaciones pagadas',
     (SELECT SUM(WithoutSalary) from vacationreq where EmployeeId = employees.Id) as 'vacaciones sin pagar'

     from employees
      where Active = 1`,

    `insert into employees 
     ( Name, PaternalLastName, MaternalLastName, Account, AdmissionDate, Blood, CURP, EmmergencyContact, EmmergencyNumber, NSS, NoEmpleado, PositionId, RFC, AreaId,BornLocation, Genre, Sons, ClinicNo, Email, Number, Direction, Bank, InfonavitNo, Infonavitfee, InfonavitDiscount, PositionType, HYR, CIM, Shift, NominaSalary, IMMSSalary ) 
     values ( ?, ?, ?, ?, ?, ?,  ?, ?, ?,  ?, ?, (select Id from positions where NoEmpleado = ?), ?, (select Id from areas where NoEmpleado = ?), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,

    `update employees set
     NoEmpleado = ?,  Name=?, PaternalLastName=?, MaternalLastName=?, PositionId = (select id from  positions where Name = ?), AreaId = (select id from  areas where Name = ?), NSS = ?, CURP = ?, RFC = ?, Blood = ?, Account = ?,
     EmmergencyContact = ?, EmmergencyNumber = ?, AdmissionDate = ?, Vacations = ?, BornLocation = ?, Genre = ?, Sons = ?, ClinicNo = ?, Email = ?, Number = ?, Direction = ?, Bank = ?, 
     InfonavitNo = ?, Infonavitfee = ?, InfonavitDiscount = ?, PositionType = ?, HYR = ?, CIM = ?, Shift = ?, NominaSalary = ?, IMMSSalary = ?
     where Id = ? `,

    `select Id, NoEmpleado as 'No. Empleado', Name as Nombre,(Select Name from positions where positions.Id =employees.PositionId) as Posicion,(Select Name from areas where areas.Id =employees.AreaId) as Area  , NSS, CURP, RFC, Blood as Sangre, Account as Cuenta, EmmergencyContact as 'Contacto de emergencia', EmmergencyNumber as 'Numero de emergencia', AdmissionDate as 'Fecha de ingreso', Vacations as Vacaciones from employees where Id = ?`,
];

export const getEmployeData = async (req: Request, res: Response) => {
    db.query(querys[0], [req.body.Material], async (err: any, rows: any) => {
        if (err) return sendError(res, 500, err);

        rows.forEach((row: any) => {
            row["Fecha de ingreso"] = row["Fecha de ingreso"].toISOString().split("T")[0];
            row["vacaciones pagadas"] = row["vacaciones pagadas"] || 0;
            row["vacaciones sin pagar'"] = row["vacaciones sin pagar'"] || 0;
        });

        res.send(rows);
    });
};

export const addEmployee = async (req: Request, res: Response) => {
    console.log(req.body);

    db.query(
        querys[1],
        [
            req.body.Cuenta,
            req.body["Fecha de ingreso"],
            req.body.Sangre,
            req.body.CURP,
            req.body["Contacto de emergencia"],
            req.body["Numero de emergencia"],
            req.body.NSS,
            req.body["No. Empleado"],
            req.body.Posicion,
            req.body.RFC,
            req.body.Area,
            req.body["Lugar de nacimiento"],
            req.body["Genero"],
            req.body["Hijos"],
            req.body["Numero de clinica"],
            req.body["Email"],
            req.body["Numero de telefono"],
            req.body["Direccion"],
            req.body["Banco"],
            req.body["Numero de infonavit"],
            req.body["Cuota fija de infonavit"],
            req.body["Descuento de infonavit"],
            req.body["Tipo de posicion"],
            req.body["Cambio de HYR"],
            req.body["Cambio de CIM"],
            req.body["Turno"],
            req.body["Salario de nomina"],
            req.body["Salario integrado IMMS"],
        ],
        async (err: any, rows: any) => {
            if (err) return sendError(res, 500, err);

            const [firstDate, secondDate] = getWeekDays(req.body["Fecha de ingreso"]);
            req.body.EmployeeId = rows.insertId;
            db.query("select Id from assistance where Date = ?", [firstDate], async (err: any, rows: any) => {
                if (rows.length === 0) return res.send("completed");
                createSingleAssitance(req, res);
            });
        }
    );
};

export const updateEmployee = async (req: Request, res: Response) => {
    req.body["Cambio de HYR"] = req.body["Cambio de HYR"] ? req.body["Cambio de HYR"] : null;
    req.body["Cambio de CIM"] = req.body["Cambio de CIM"] ? req.body["Cambio de CIM"] : null;

    db.query(
        querys[2],
        [
            req.body["No. Empleado"],
            req.body["Nombre"],
            req.body["Posicion"],
            req.body["Area"],
            req.body["NSS"],
            req.body["CURP"],
            req.body["RFC"],
            req.body["Sangre"],
            req.body["Cuenta"],
            req.body["Contacto de emergencia"],
            req.body["Numero de emergencia"],
            req.body["Fecha de ingreso"],
            req.body["Vacaciones"],
            req.body["Lugar de nacimiento"],
            req.body["Genero"],
            req.body["Hijos"],
            req.body["Numero de clinica"],
            req.body["Email"],
            req.body["Numero de telefono"],
            req.body["Direccion"],
            req.body["Banco"],
            req.body["Numero de infonavit"],
            req.body["Cuota fija de infonavit"],
            req.body["Descuento de infonavit"],
            req.body["Tipo de posicion"],
            req.body["Cambio de HYR"],
            req.body["Cambio de CIM"],
            req.body["Turno"],
            req.body["Salario de nomina"],
            req.body["Salario integrado IMMS"],
            req.body.Id,
        ],
        async (err: any, rows: any) => {
            if (err) return sendError(res, 500, err);

            db.query(querys[3], [req.body.Id], async (err: any, rows: any) => {
                if (err) return sendError(res, 500, err);

                rows.forEach((row: any) => {
                    row["Fecha de ingreso"] = row["Fecha de ingreso"].toISOString().split("T")[0];
                });

                res.send(rows);
            });
        }
    );
};

export const quitEmployee = async (req: Request, res: Response) => {
    const [firstDate, secondDate] = getWeekDays(req.body.Date);

    db.query("update employees set Active = 0, QuitDate = ? where Id = ?", [secondDate, req.body.EmployeeId], async (err: any, rows: any) => {
        if (err) return sendError(res, 500, err);

        res.send("Completed");
    });
};

export const makeVacationReq = async (req: Request, res: Response) => {
    try {
        sql.query("insert into vacationreq (EmployeeId, Days, StartDate, EndDate, RequestDate) values ((select Id from employees where NoEmpleado = ?),?,?,?,?)", [parseInt(req.body.EmployeeNo), req.body.Days, req.body.StartDate, req.body.EndDate, "2024-01-17"]);
        res.send("completed");
    } catch (err) {
        sendError(res, 500, err);
    }
};

module.exports = {
    getEmployeData,
    addEmployee,
    updateEmployee,
    quitEmployee,
    makeVacationReq,
};
