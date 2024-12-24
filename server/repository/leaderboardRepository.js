const db = require('../configuration/db');

const updateLeaderboard = async (sessionId, leaderboardData) => {
    console.log('Updating leaderboard for session:', sessionId, leaderboardData);
    const deleteResult = await db.query(
        `DELETE FROM leaderboards WHERE session_id = $1`,
        [sessionId]
    );
    console.log('Deleted old leaderboard entries:', deleteResult.rowCount);

    const queries = leaderboardData.map(data =>
        db.query(
            `INSERT INTO leaderboards (session_id, car_number, fastest_lap, current_lap)
             VALUES ($1, $2, $3, $4)`,
            [sessionId, data.car_number, data.fastest_lap, data.current_lap]
        )
    );
    await Promise.all(queries);
    console.log('Leaderboard updated successfully.');
};

const getLeaderboard = async (sessionId) => {
    const result = await db.query(
        `SELECT
             lt.car_number,
             rd.name AS driver_name,
             TO_CHAR(MIN(lt.lap_time), 'MI:SS.MS') AS fastest_lap,
             TO_CHAR(lt.lap_time, 'MI:SS.MS') AS current_lap_time,
             MAX(lt.lap_number) AS current_lap
         FROM lap_times lt
                  JOIN driver_assignments da ON lt.car_number = da.car_number AND lt.session_id = da.session_id
                  JOIN race_drivers rd ON da.driver_id = rd.id
         WHERE lt.session_id = $1
         GROUP BY lt.car_number, rd.name, lt.lap_time
         ORDER BY MIN(lt.lap_time) ASC;`,
        [sessionId]
    );
    return result.rows;
};

module.exports = {
    updateLeaderboard,
    getLeaderboard,
};