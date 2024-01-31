import db from "../../utilities/db";
import { getWeekDays, separateAreas } from "../../utilities/functions";
import sendError from "../../utilities/sendError";
import { Response, Request } from "express";

const querys = [
    `SELECT ep.Id, e.Name as Empleado,(select Name From areas where id = a.AreaId) as Area, p.Name as Posicion, a.Date as Fecha,
    (SELECT i.Code FROM incidences i WHERE i.Id = a.IncidenceId0) AS Incidence1,
    0Code0, 0Goal0, 0Produced0, 0Code1, 0Goal1, 0Produced1, 0Code2, 0Goal2, 0Produced2, 0Comment,
    (SELECT i.Code FROM incidences i WHERE i.Id = a.IncidenceId1) AS Incidence2,
    1Code0, 1Goal0, 1Produced0, 1Code1, 1Goal1, 1Produced1, 1Code2, 1Goal2, 1Produced2, 1Comment,
    (SELECT i.Code FROM incidences i WHERE i.Id = a.IncidenceId2) AS Incidence3,
    2Code0, 2Goal0, 2Produced0, 2Code1, 2Goal1, 2Produced1, 2Code2, 2Goal2, 2Produced2, 2Comment,
    (SELECT i.Code FROM incidences i WHERE i.Id = a.IncidenceId3) AS Incidence4,
    3Code0, 3Goal0, 3Produced0, 3Code1, 3Goal1, 3Produced1, 3Code2, 3Goal2, 3Produced2, 3Comment,
    (SELECT i.Code FROM incidences i WHERE i.Id = a.IncidenceId4) AS Incidence5,
    4Code0, 4Goal0, 4Produced0, 4Code1, 4Goal1, 4Produced1, 4Code2, 4Goal2, 4Produced2, 4Comment
    FROM employeeproductivity ep
    JOIN assistance a ON a.Id = ep.assistanceId
    JOIN employees e on a.employeeId = e.id
    JOIN positions p on a.positionId = p.id
    WHERE a.Date = ?;
`,

    `SELECT ep.Id, e.Name as Empleado,(select Name from areas where id = a.AreaId) as Area, p.Name as Posicion, a.Date as Fecha,
    (SELECT i.Code FROM incidences i WHERE i.Id = a.IncidenceId0) AS Incidence1,
    0Code0, 0Goal0, 0Produced0, 0Code1, 0Goal1, 0Produced1, 0Code2, 0Goal2, 0Produced2, 0Comment,
    (SELECT i.Code FROM incidences i WHERE i.Id = a.IncidenceId1) AS Incidence2,
    1Code0, 1Goal0, 1Produced0, 1Code1, 1Goal1, 1Produced1, 1Code2, 1Goal2, 1Produced2, 1Comment,
    (SELECT i.Code FROM incidences i WHERE i.Id = a.IncidenceId2) AS Incidence3,
    2Code0, 2Goal0, 2Produced0, 2Code1, 2Goal1, 2Produced1, 2Code2, 2Goal2, 2Produced2, 2Comment,
    (SELECT i.Code FROM incidences i WHERE i.Id = a.IncidenceId3) AS Incidence4,
    3Code0, 3Goal0, 3Produced0, 3Code1, 3Goal1, 3Produced1, 3Code2, 3Goal2, 3Produced2, 3Comment,
    (SELECT i.Code FROM incidences i WHERE i.Id = a.IncidenceId4) AS Incidence5,
    4Code0, 4Goal0, 4Produced0, 4Code1, 4Goal1, 4Produced1, 4Code2, 4Goal2, 4Produced2, 4Comment
    FROM employeeproductivity ep
    JOIN assistance a ON a.Id = ep.assistanceId
    JOIN employees e on a.employeeId = e.id
    JOIN positions p on a.positionId = p.id
    WHERE a.employeeId = (select id from employees where NoEmpleado = ?) and a.Date = ?;
`,

    `update employeeproductivity set
    0Comment=?, 0Code0=?, 0Code1=?, 0Code2=?, 0Goal0=?, 0Goal1=?, 0Goal2=?, 0Produced0=?, 0Produced1=?, 0Produced2=?, 1Comment=?, 1Code0=?, 1Code1=?, 1Code2=?, 1Goal0=?, 1Goal1=?, 1Goal2=?, 1Produced0=?, 1Produced1=?, 1Produced2=?, 2Comment=?, 2Code0=?, 2Code1=?, 2Code2=?, 2Goal0=?, 2Goal1=?, 2Goal2=?, 2Produced0=?, 2Produced1=?, 2Produced2=?, 3Comment=?, 3Code0=?, 3Code1=?, 3Code2=?, 3Goal0=?, 3Goal1=?, 3Goal2=?, 3Produced0=?, 3Produced1=?, 3Produced2=?, 4Code0=?, 4Code1=?, 4Code2=?, 4Comment=?, 4Code0=?, 4Code1=?, 4Code2=?, 4Goal0=?, 4Goal1=?, 4Goal2=?, 4Produced0=?, 4Produced1=?, 4Produced2=?
    where Id = ?`,

    `insert into employeeproductivity (AssistanceId) 
    SELECT Id FROM assistance WHERE date = ? AND AreaId IN (2, 5, 6, 7, 8, 9, 10, 11, 12)`,

    `insert into employeeproductivity (AssistanceId) 
    select id from assistance where id = ? and AreaId IN (2, 5, 6, 7, 8, 9, 10, 11, 12)`,

    `SELECT ep.Id, e.Name as Empleado,(select Name from areas where id = a.AreaId) as Area, p.Name as Posicion, a.Date as Fecha,
    (SELECT i.Code FROM incidences i WHERE i.Id = a.IncidenceId0) AS Incidence1,
    0Code0, 0Goal0, 0Produced0, 0Code1, 0Goal1, 0Produced1, 0Code2, 0Goal2, 0Produced2, 0Comment,
    (SELECT i.Code FROM incidences i WHERE i.Id = a.IncidenceId1) AS Incidence2,
    1Code0, 1Goal0, 1Produced0, 1Code1, 1Goal1, 1Produced1, 1Code2, 1Goal2, 1Produced2, 1Comment,
    (SELECT i.Code FROM incidences i WHERE i.Id = a.IncidenceId2) AS Incidence3,
    2Code0, 2Goal0, 2Produced0, 2Code1, 2Goal1, 2Produced1, 2Code2, 2Goal2, 2Produced2, 2Comment,
    (SELECT i.Code FROM incidences i WHERE i.Id = a.IncidenceId3) AS Incidence4,
    3Code0, 3Goal0, 3Produced0, 3Code1, 3Goal1, 3Produced1, 3Code2, 3Goal2, 3Produced2, 3Comment,
    (SELECT i.Code FROM incidences i WHERE i.Id = a.IncidenceId4) AS Incidence5,
    4Code0, 4Goal0, 4Produced0, 4Code1, 4Goal1, 4Produced1, 4Code2, 4Goal2, 4Produced2, 4Comment
    FROM employeeproductivity ep
    JOIN assistance a ON a.Id = ep.assistanceId
    JOIN employees e on a.employeeId = e.id
    JOIN positions p on a.positionId = p.id
    WHERE a.areaId = (select id from areas where Name = ?) and a.employeeId = (select id from employees where Name = ?) and a.Date = ?;
`,
];

export const getWeekProductivity = async (req: Request, res: Response) => {
    const [firstDate, secondDate] = getWeekDays(req.body.Date);

    db.query(querys[0], [firstDate], async (err: any, rows: any) => {
        if (err) return sendError(res, 500, err);
        res.send(separateAreas(rows));
    });
};

export const getSingle = async (req: Request, res: Response) => {
    const [firstDate, secondDate] = getWeekDays(req.body.Date);

    db.query(querys[1], [req.body.NoEmpleado, firstDate], async (err: any, rows: any) => {
        if (err) return sendError(res, 500, err);

        if (rows.length === 0) {
            db.query(querys[5], [req.body.Area, req.body.Name, firstDate], async (err: any, rows: any) => {
                res.send(rows);
            });
        }

        if (rows.length > 0) res.send(rows);
    });
};

export const updateData = async (req: Request, res: Response) => {
    const a = req.body;
    console.log(a);
    db.query(
        querys[2],
        [
            a["0Comment"],
            a["0Code0"],
            a["0Code1"],
            a["0Code2"],
            a["0Goal0"],
            a["0Goal1"],
            a["0Goal2"],
            a["0Produced0"],
            a["0Produced1"],
            a["0Produced2"],
            a["1Comment"],
            a["1Code0"],
            a["1Code1"],
            a["1Code2"],
            a["1Goal0"],
            a["1Goal1"],
            a["1Goal2"],
            a["1Produced0"],
            a["1Produced1"],
            a["1Produced2"],
            a["2Comment"],
            a["2Code0"],
            a["2Code1"],
            a["2Code2"],
            a["2Goal0"],
            a["2Goal1"],
            a["2Goal2"],
            a["2Produced0"],
            a["2Produced1"],
            a["2Produced2"],
            a["3Comment"],
            a["3Code0"],
            a["3Code1"],
            a["3Code2"],
            a["3Goal0"],
            a["3Goal1"],
            a["3Goal2"],
            a["3Produced0"],
            a["3Produced1"],
            a["3Produced2"],
            a["4Code0"],
            a["4Code1"],
            a["4Code2"],
            a["4Comment"],
            a["4Code0"],
            a["4Code1"],
            a["4Code2"],
            a["4Goal0"],
            a["4Goal1"],
            a["4Goal2"],
            a["4Produced0"],
            a["4Produced1"],
            a["4Produced2"],
            a.Id,
        ],
        async (err: any, rows: any) => {
            console.log(err);

            if (err) return sendError(res, 500, err);

            res.send(rows);
        }
    );
};

export const createProductivityWeek = async (req: Request, res: Response) => {
    const [firstDate, secondDate] = getWeekDays(req.body.Date);

    db.query(querys[3], [firstDate], async (err: any, rows: any) => {
        if (err) return sendError(res, 500, err);
        res.send(rows);
    });
};

export const createSingleProductivity = async (req: Request, res: Response) => {
    db.query(querys[4], [req.body.AssistanceId], async (err: any, rows: any) => {
        if (err) return sendError(res, 500, err);
        res.send("completed");
    });
};
