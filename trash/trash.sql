-- select *,
SELECT ep.*, e.Name AS employee, p.Name AS position,
 (SELECT i.Code FROM incidences i WHERE i.Id = a.IncidenceId0) AS incidence1,
 (SELECT i.Code FROM incidences i WHERE i.Id = a.IncidenceId1) AS incidence2,
 (SELECT i.Code FROM incidences i WHERE i.Id = a.IncidenceId2) AS incidence3,
 (SELECT i.Code FROM incidences i WHERE i.Id = a.IncidenceId3) AS incidence4,
 (SELECT i.Code FROM incidences i WHERE i.Id = a.IncidenceId4) AS incidence5
FROM employeeProductivity ep
JOIN employees e ON ep.EmployeeId = e.Id
JOIN positions p ON ep.PositionId = p.Id
JOIN assistance a where a.Id = ep.assistanceId
-- WHERE ep.Date = '2023-10-09';







