import db from "../../utilities/db";
import sql from "../../utilities/db2";
import sendError from "../../utilities/sendError";
import { createSingleAssitance } from "./Assistance";
import { getWeekDays } from "../../utilities/functions";
import { Response, Request } from "express";

export const querys = [
    `select Id, NoEmpleado as 'No. Empleado', Name as Nombre, PaternalLastName as 'Apellido paterno', MaternalLastName as 'Apellido materno', (Select Name from positions where positions.Id =employees.PositionId) as Posicion, 
     (Select Name from areas where areas.Id =employees.AreaId) as Area  , NSS, CURP, RFC, Blood as Sangre, Account as Cuenta, EmmergencyContact as 'Contacto de emergencia',
     EmmergencyNumber as 'Numero de emergencia', AdmissionDate as 'Fecha de ingreso', 
     BornLocation as 'Lugar de nacimiento', Genre as Genero, Sons as Hijos, ClinicNo as 'Numero de clinica', Email, Number as 'Numero de telefono', Direction as Direccion,
     Bank as Banco, InfonavitNo as 'Numero de infonavit', InfonavitFee as 'Cuota fija de infonavit', InfonavitDiscount as 'Descuento de infonavit', PositionType as 'Tipo de posicion',
     CIM as 'Cambio de CIM', Shift as Turno, NominaSalary as 'Salario de nomina', IMMSSalary as 'Salario integrado IMMS', Studies as Estudios, BornDate as FDNAC,
     CivilStatus as 'Estado civil', Nationality as Nacionalidad, 

     (SELECT SUM(WithSalary) from vacationreq where EmployeeId = employees.Id) as 'vacaciones pagadas',
     (SELECT SUM(WithoutSalary) from vacationreq where EmployeeId = employees.Id) as 'vacaciones sin pagar'

     from employees
     where Active = 1`,

    `INSERT INTO employees 
    (NoEmpleado, Name, PaternalLastName, MaternalLastName, Account, AdmissionDate, Blood, CURP, EmmergencyContact, EmmergencyNumber, NSS, RFC, BornLocation, Genre, Sons, ClinicNo, Email, Number, Direction, Bank, InfonavitNo, InfonavitFee, InfonavitDiscount, PositionType, CIM, Shift, NominaSalary, IMMSSalary, Studies, BornDate, Nationality, CivilStatus, PositionId, AreaId) 
VALUES 
    (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, (SELECT Id FROM positions WHERE NoEmpleado = ?), (SELECT Id FROM areas WHERE NoEmpleado = ?));
`,

    `UPDATE employees SET
    NoEmpleado = ?,  
    Name = ?, 
    PaternalLastName = ?, 
    MaternalLastName = ?, 
    NSS = ?, 
    CURP = ?, 
    RFC = ?, 
    Blood = ?, 
    Account = ?, 
    EmmergencyContact = ?, 
    EmmergencyNumber = ?, 
    AdmissionDate = ?, 
    BornLocation = ?, 
    Genre = ?, 
    Sons = ?, 
    ClinicNo = ?, 
    Email = ?, 
    Number = ?, 
    Direction = ?, 
    Bank = ?, 
    InfonavitNo = ?, 
    Infonavitfee = ?, 
    InfonavitDiscount = ?, 
    PositionType = ?,  
    CIM = ?, 
    Shift = ?, 
    NominaSalary = ?, 
    IMMSSalary = ?, 
    Studies = ?,
    BornDate = ?, 
    Nationality = ?, 
    CivilStatus = ?, 
    PositionId = (SELECT id FROM positions WHERE Name = ?),
    AreaId = (SELECT id FROM areas WHERE Name = ?)
WHERE Id = ?`,

    `select Id, NoEmpleado as 'No. Empleado', Name as Nombre,(Select Name from positions where positions.Id =employees.PositionId) as Posicion,(Select Name from areas where areas.Id =employees.AreaId) as Area  , NSS, CURP, RFC, Blood as Sangre, Account as Cuenta, EmmergencyContact as 'Contacto de emergencia', EmmergencyNumber as 'Numero de emergencia', AdmissionDate as 'Fecha de ingreso' from employees where Id = ?`,

    `select Id, NoEmpleado as 'No. Empleado', Name as Nombre, PaternalLastName as 'Apellido paterno', MaternalLastName as 'Apellido materno', (Select Name from positions where positions.Id =employees.PositionId) as Posicion, 
    (Select Name from areas where areas.Id =employees.AreaId) as Area, QuitDate as "Fecha de baja", QuitStatus as Estado, QuitReason as "Motivo de baja", QuitNotes as "Nota"

    from employees
    where Active = 0`,
];

const columnRenaming = {
    "No. Empleado": "NoEmpleado",
    Nombre: "Name",
    "Apellido paterno": "PaternalLastName",
    "Apellido materno": "MaternalLastName",
    NSS: "NSS",
    CURP: "CURP",
    RFC: "RFC",
    Sangre: "Blood",
    Cuenta: "Account",
    "Contacto de emergencia": "EmmergencyContact",
    "Numero de emergencia": "EmmergencyNumber",
    "Fecha de ingreso": "AdmissionDate",
    "Lugar de nacimiento": "BornLocation",
    Genero: "Genre",
    Hijos: "Sons",
    "Numero de clinica": "ClinicNo",
    Email: "Email",
    "Numero de telefono": "Number",
    Direccion: "Direction",
    Banco: "Bank",
    "Numero de infonavit": "InfonavitNo",
    "Cuota fija de infonavit": "InfonavitFee",
    "Descuento de infonavit": "InfonavitDiscount",
    "Tipo de posicion": "PositionType",
    "Cambio de CIM": "CIM",
    Turno: "Shift",
    "Salario de nomina": "NominaSalary",
    "Salario integrado IMMS": "IMMSSalary",
    Estudios: "Studies",
    FDNAC: "BornDate",
    "Estado civil": "CivilStatus",
    Nacionalidad: "Nationality",
    Posicion: "PositionId",
    Area: "AreaId",
    Id: "Id",
};

interface EmployeeModel {
    id?: number;
    Nombre: string;
    "Apellido paterno": string;
    "Apellido materno": string;
    "No. Empleado": string;
    NSS: string;
    CURP: string;
    RFC: string;
    Sangre: string;
    Cuenta: string;
    "Contacto de emergencia": string;
    "Numero de emergencia": string;
    "Fecha de ingreso": string;
    "Lugar de nacimiento": string;
    Genero: string;
    Hijos: number;
    "Numero de clinica": string;
    Email: string;
    "Numero de telefono": string;
    Direccion: string;
    Banco: string;
    "Numero de infonavit": string;
    "Cuota fija de infonavit": string;
    "Descuento de infonavit": string;
    "Tipo de posicion": string;
    "Cambio de CIM": string;
    Turno: string;
    "Salario de nomina": string;
    "Salario integrado IMMS": string;
    Estudios: string;
    FDNAC: string;
    "Estado civil": string;
    Nacionalidad: string;
    Posicion: string;
    Area: string;
}

export const getEmployeeData = async (req: Request, res: Response) => {
    db.query(querys[0], async (err: any, rows: any) => {
        if (err) return sendError(res, 500, err);

        rows.forEach((row: any) => {
            row["Fecha de ingreso"] = row["Fecha de ingreso"] ? row["Fecha de ingreso"].toISOString().split("T")[0] : null;
            row["FDNAC"] = row["FDNAC"] ? row["FDNAC"].toISOString().split("T")[0] : null;
            row["Cambio de CIM"] = row["Cambio de CIM"] ? (row["Cambio de CIM"] ? row["Cambio de CIM"].toISOString().split("T")[0] : null) : null;
            row["vacaciones pagadas"] = row["vacaciones pagadas"] ? row["vacaciones pagadas"] || 0 : null;
            row["vacaciones sin pagar"] = row["vacaciones sin pagar"] ? row["vacaciones sin pagar"] || 0 : null;
        });

        res.send(rows);
    });
};

export const getInactiveEmployeeData = async (req: Request, res: Response) => {
    db.query(querys[4], async (err: any, rows: any) => {
        if (err) return sendError(res, 500, err);

        rows.forEach((row: any) => {
            row["Fecha de baja"] = row["Fecha de baja"] ? row["Fecha de baja"].toISOString().split("T")[0] : null;
        });

        res.send(rows);
    });
};

export const getEmployeeModel = (req: Request, res: Response) => {
    const employeeBase: any = { ...columnRenaming };

    for (const key of Object.keys(employeeBase)) {
        employeeBase[key] = null;
    }

    res.send(employeeBase);
};

export const addEmployee = async (req: Request, res: Response) => {
    db.query(querys[1], generateEmployeeBody(req.body), async (err: any, rows: any) => {
        if (err) return sendError(res, 500, err);

        const [firstDate, secondDate] = getWeekDays(req.body["Fecha de ingreso"]);
        req.body.EmployeeId = rows.insertId;
        db.query("select Id from assistance where Date = ?", [firstDate], async (err: any, rows: any) => {
            if (rows.length === 0) return res.send("completed");
            createSingleAssitance(req, res);
        });
    });
};

export const updateEmployee = async (req: Request, res: Response) => {
    req.body["Cambio de CIM"] = req.body["Cambio de CIM"] ? req.body["Cambio de CIM"] : null;

    db.query(querys[2], generateEmployeeBody(req.body), async (err: any, rows: any) => {
        if (err) return sendError(res, 500, err);

        db.query(querys[3], [req.body.Id], async (err: any, rows: any) => {
            if (err) return sendError(res, 500, err);

            rows.forEach((row: any) => {
                row["Fecha de ingreso"] = row["Fecha de ingreso"].toISOString().split("T")[0];
            });

            res.send(rows);
        });
    });
};

export const quitEmployee = async (req: Request, res: Response) => {
    try {
        const result = await sql.query("update employees set Active = 0, QuitDate = ?, QuitStatus = ?, QuitReason = ?, QuitNotes = ?  where Id = ?", [req.body.quitDate, req.body.quitStatus, req.body.quitReason, req.body.quitNote, req.body.Id]);
        console.log(result);
        res.send("completed");
    } catch (err) {
        if (err) return sendError(res, 500, err);
    }
};

export const makeVacationReq = async (req: Request, res: Response) => {
    try {
        sql.query("insert into vacationreq (EmployeeId, Days, StartDate, EndDate, RequestDate) values ((select Id from employees where NoEmpleado = ?),?,?,?,?)", [parseInt(req.body.EmployeeNo), req.body.Days, req.body.StartDate, req.body.EndDate, "2024-01-17"]);
        res.send("completed");
    } catch (err) {
        sendError(res, 500, err);
    }
};

export const getDataForExcel = async (req: Request, res: Response) => {
    db.query(querys[0], async (err: any, rows: any) => {
        if (err) return sendError(res, 500, err);

        rows.forEach((row: any) => {
            row["Fecha de ingreso"] = row["Fecha de ingreso"] ? row["Fecha de ingreso"].toISOString().split("T")[0] : null;
            row["FDNAC"] = row["FDNAC"] ? row["FDNAC"].toISOString().split("T")[0] : null;
            row["Cambio de CIM"] = row["Cambio de CIM"] ? (row["Cambio de CIM"] ? row["Cambio de CIM"].toISOString().split("T")[0] : null) : null;
            row["vacaciones pagadas"] = row["vacaciones pagadas"] ? row["vacaciones pagadas"] || 0 : null;
            row["vacaciones sin pagar"] = row["vacaciones sin pagar"] ? row["vacaciones sin pagar"] || 0 : null;
        });

        res.send(rows);
    });
};

export const getInactiveEmployeeDataForExcel = async (req: Request, res: Response) => {
    db.query(querys[4], async (err: any, rows: any) => {
        if (err) return sendError(res, 500, err);

        rows.forEach((row: any) => {
            row["Fecha de baja"] = row["Fecha de baja"] ? row["Fecha de baja"].toISOString().split("T")[0] : null;
        });

        res.send(rows);
    });
};

const generateEmployeeBody = (body: any) => {
    const result: Array<any> = [];
    const keys = Object.keys(columnRenaming);
    for (const key of keys) {
        result.push(body[key]);
    }
    return result;
};
