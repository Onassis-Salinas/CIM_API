export function getWeekDays(dateString: any) {
    if (dateString instanceof Date) {
        dateString = dateString.toISOString().split("T")[0];
    } else if (dateString.includes("T")) {
        dateString = dateString.split("T")[0];
    }

    console.log(dateString);
    const date = new Date(dateString);
    const dayOfWeek = date.getDay();

    const monday = new Date(date);
    monday.setDate(date.getDate() - dayOfWeek);

    const friday = new Date(date);
    friday.setDate(date.getDate() - (dayOfWeek - 4));

    return [monday.toISOString().split("T")[0], friday.toISOString().split("T")[0]];
}

export function getDayNumber(date: any) {
    let dateObject = new Date(date);
    return dateObject.getDay() - 1;
}

export function separateAreas(rows: any) {
    let tableExists;
    let tables: Array<any> = [];

    rows.forEach((row: any) => {
        tableExists = false;
        tables.forEach((table, i) => {
            if (row.Area === table.Name) {
                tableExists = true;
                return tables[i].Rows.push(row);
            }
        });
        if (tableExists) return;
        tables.push({ Name: row.Area, Rows: [] });
        tables[tables.length - 1].Rows.push(row);
    });

    return tables;
}
