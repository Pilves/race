const db = require('../configuration/db');

const addLapTime = async (sessionId, carNumber, lapTime, lapNumber, timestamp) => {
    console.log('Executing query to insert lap time:', { sessionId, carNumber, lapTime, lapNumber, timestamp });
    const result = await db.query(
        `INSERT INTO lap_times (session_id, car_number, lap_time, lap_number, timestamp)
         VALUES ($1, $2, $3::interval, $4, $5::timestamp)
         RETURNING *`,
        [sessionId, carNumber, lapTime, lapNumber, timestamp]
    );
    console.log('Query result:', result.rows);
    return result.rows[0];
};

const getLapTimes = async (sessionId) => {
    const result = await db.query(
        `SELECT
            lt.car_number,
            lt.lap_time,
            lt.lap_number,
            lt.timestamp::text AS timestamp, 
            rd.name AS driver_name
         FROM lap_times lt
         JOIN driver_assignments da ON lt.car_number = da.car_number AND lt.session_id = da.session_id
         JOIN race_drivers rd ON da.driver_id = rd.id
         WHERE lt.session_id = $1
         ORDER BY lt.car_number, lt.lap_number;`,
        [sessionId]
    );
    return result.rows;
};

const getFastestLapTimes = async (sessionId) => {
    const result = await db.query(
        `SELECT
            lt.car_number,
            rd.name AS driver_name,
            EXTRACT(EPOCH FROM MIN(lt.lap_time)) * 1000 AS fastest_lap,
            MAX(lt.lap_number) AS current_lap
         FROM lap_times lt
         JOIN driver_assignments da ON lt.car_number = da.car_number AND lt.session_id = da.session_id
         JOIN race_drivers rd ON da.driver_id = rd.id
         WHERE lt.session_id = $1
         GROUP BY lt.car_number, rd.name
         ORDER BY fastest_lap ASC;`,
        [sessionId]
    );
    return result.rows;
};

module.exports = {
    addLapTime,
    getFastestLapTimes,
    getLapTimes
};