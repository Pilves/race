const db = require('../configuration/db');
const CustomError = require('../middleware/customError');

const addRaceSession = async (sessionName) => {
    const query = `
        INSERT INTO race_sessions (session_name, mode_id)
        VALUES ($1, NULL) 
        RETURNING *;
    `;
    const values = [sessionName];
    try {
        const result = await db.query(query, values);
        console.log('Added new race session:', result.rows[0]);
        return result.rows[0];
    } catch (error) {
        throw new CustomError(500, `Database error: ${error.message}`);
    }
};

const getRaceSessions = async () => {
    const query = `
        SELECT rs.id AS session_id,
               rs.session_name,
               rm.mode_name,
               json_agg(
                   json_build_object(
                       'driver_name', rd.name,
                       'car_number', c.car_number
                   )
               ) AS participants
        FROM race_sessions rs
        LEFT JOIN driver_assignments da ON da.session_id = rs.id
        LEFT JOIN race_drivers rd ON da.driver_id = rd.id
        LEFT JOIN cars c ON da.car_number = c.car_number
        LEFT JOIN race_modes rm ON rs.mode_id = rm.id
        WHERE rm.mode_name IS DISTINCT FROM 'Finish'
        AND rm.mode_name IS DISTINCT FROM 'Danger'
        AND rm.mode_name IS DISTINCT FROM 'Hazard'
        GROUP BY rs.id, rs.session_name, rm.mode_name
    `;
    try {
        const result = await db.query(query);
        return result.rows;
    } catch (error) {
        throw new CustomError(500, `Database error: ${error.message}`);
    }
};

const updateRaceSession = async (id, sessionName) => {
    const query = `
        UPDATE race_sessions
        SET session_name = $1
        WHERE id = $2
        RETURNING *;
    `;
    const values = [sessionName, id];
    try {
        const result = await db.query(query, values);
        if (result.rows.length === 0) {
            throw new CustomError(404, `Race session with ID ${id} not found`);
        }
        return result.rows[0];
    } catch (error) {
        throw new CustomError(500, `Database error: ${error.message}`);
    }
};

const deleteRaceSession = async (id) => {
    const query = `DELETE
                   FROM race_sessions
                   WHERE id = $1
                   RETURNING *;`;
    const values = [id];
    try {
        const result = await db.query(query, values);
        if (result.rows.length === 0) {
            throw new CustomError(404, `Race session with ID ${id} not found`);
        }
        return result.rows[0];
    } catch (error) {
        throw new CustomError(500, `Database error: ${error.message}`);
    }
};

const getRaceMods = async () => {
    const query = 'SELECT * FROM race_modes';
    try {
        const result = await db.query(query);
        return result.rows;
    } catch (error) {
        throw new Error(`Database error: ${error.message}`);
    }
};

const assignDriverToSession = async (sessionId, driverId, carNumber) => {
    if (!sessionId || !driverId || !carNumber) {
        throw new Error('Session ID, Driver ID, and Car Number are required.');
    }

    const query = `
        INSERT INTO driver_assignments (session_id, driver_id, car_number)
        VALUES ($1, $2, $3)
        RETURNING *;
    `;
    const values = [sessionId, driverId, carNumber];

    try {
        const result = await db.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw new Error(`Database error: ${error.message}`);
    }
};

const getDriversForSession = async (sessionId) => {
    const query = `SELECT da.id, d.name AS driver_name, c.car_number
                   FROM driver_assignments da
                            JOIN race_drivers d ON da.driver_id = d.id
                            JOIN cars c ON da.car_number = c.car_number
                   WHERE da.session_id = $1
    `;
    const values = [sessionId];
    try {
        const result = await db.query(query, values);
        return result.rows;
    } catch (error) {
        throw new CustomError(500, `Database error: ${error.message}`);
    }
};

const removeDriverFromSession = async (assignmentId) => {
    const query = `DELETE
                   FROM driver_assignments
                   WHERE id = $1
                   RETURNING *`;
    const values = [assignmentId];
    try {
        const result = await db.query(query, values);
        if (result.rows.length === 0) {
            throw new CustomError(404, `Driver assignment with ID ${assignmentId} not found`);
        }
        return result.rows[0];
    } catch (error) {
        throw new CustomError(500, `Database error: ${error.message}`);
    }
};

const getNextRaceSession = async () => {
    const query = `
        SELECT rs.id AS session_id,
               rs.session_name,
               json_agg(
                   json_build_object(
                       'driver_name', rd.name,
                       'car_number', c.car_number
                   )
               ) AS participants
        FROM race_sessions rs
        LEFT JOIN driver_assignments da ON da.session_id = rs.id
        LEFT JOIN race_drivers rd ON rd.id = da.driver_id
        LEFT JOIN cars c ON da.car_number = c.car_number
        WHERE rs.mode_id IS NULL OR rs.mode_id != (SELECT id FROM race_modes WHERE mode_name = 'Finished')
        GROUP BY rs.id, rs.session_name
        ORDER BY rs.id ASC
        LIMIT 1;
    `;
    try {
        console.log('Running getNextRaceSession query...');
        const result = await db.query(query);
        console.log('Query result:', JSON.stringify(result.rows, null, 2));
        if (result.rows.length === 0) {
            console.warn('No valid upcoming race sessions found');
            return null;
        }
        return result.rows[0];
    } catch (error) {
        console.error('Error in getNextRaceSession:', error.message);
        throw new CustomError(500, `Database error: ${error.message}`);
    }
};

const getCurrentModeForSession = async (sessionId) => {
    const query = `
        SELECT rm.id AS mode_id, rm.mode_name, rm.display, rs.id AS session_id
        FROM race_sessions rs 
        JOIN race_modes rm ON rs.mode_id = rm.id
        WHERE rs.id = $1
    `;
    const values = [sessionId];
    try {
        const result = await db.query(query, values);
        return result.rows[0] || null;
    } catch (error) {
        throw new CustomError(500, `Database error: ${error.message}`);
    }
};

const getModeByName = async (modeName) => {
    const query = `
        SELECT id, mode_name, display
        FROM race_modes
        WHERE mode_name = $1
        LIMIT 1;
    `;
    const values = [modeName];

    try {
        const result = await db.query(query, values);
        if (result.rows.length === 0) {
            throw new Error(`Race mode "${modeName}" not found`);
        }
        return result.rows[0];
    } catch (error) {
        throw new Error(`Database error: ${error.message}`);
    }
};

const setRaceMode = async (sessionId, modeId) => {
    const query = `
        UPDATE race_sessions
        SET mode_id = $1
        WHERE id = $2
        RETURNING *;
    `;
    const values = [modeId, sessionId];

    try {
        const result = await db.query(query, values);
        if (result.rows.length === 0) {
            throw new CustomError(404, `Race session with ID ${sessionId} not found`);
        }
        return result.rows[0];
    } catch (error) {
        throw new CustomError(500, `Database error: ${error.message}`);
    }
};

const validateModeChange = async (sessionId, newModeId) => {
    const query = `
        SELECT rs.mode_id, rm.mode_name
        FROM race_sessions rs
        JOIN race_modes rm ON rs.mode_id = rm.id
        WHERE rs.id = $1;
        `;
    const values = [sessionId];

    try {
        const result = await db.query(query, values);
        if (result.rows.length === 0) {
            throw new CustomError(404, `Race session with ID ${sessionId} not found`);
        }

        const currentMode = result.rows[0].mode_name;
        if (currentMode === 'Finish') {
            throw new CustomError(400, 'Cannot change mode: Race is already finished');
        }

        return true;
    } catch (error) {
        if (error instanceof CustomError) throw error;
        throw new CustomError(500, `Database error: ${error.message}`);
    }
};

module.exports = {
    getRaceMods,
    addRaceSession,
    getRaceSessions,
    updateRaceSession,
    deleteRaceSession,
    assignDriverToSession,
    getDriversForSession,
    removeDriverFromSession,
    getNextRaceSession,
    setRaceMode,
    getModeByName,
    getCurrentModeForSession,
    validateModeChange
}
