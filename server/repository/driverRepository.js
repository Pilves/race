const db = require('../configuration/db');

const addDriver = async (name) => {
    const query = 'INSERT INTO race_drivers (name) VALUES ($1) RETURNING *;';
    const values = [name];
    try {
        const result = await db.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw new Error(`Database error: ${error.message}`);
    }
};

const getDrivers = async () => {
    const query = 'SELECT * FROM race_drivers;';
    try {
        const result = await db.query(query);
        return result.rows;
    } catch (error) {
        throw new Error(`Database error: ${error.message}`);
    }
};

const getAvailableDrivers = async (sessionId) => {
    const query = `
    SELECT d.*
    FROM race_drivers d 
    WHERE NOT EXISTS (
        SELECT 1
        FROM driver_assignments da
        WHERE da.driver_id = d.id
        AND da.session_id = $1
    )
    `;
    const values = [sessionId];
    try {
        const result = await db.query(query, values);
        return result.rows;
    } catch (error) {
        throw new Error(`Database error: ${error.message}`);
    }
}

const updateDriver = async (id, name) => {
    const query = 'UPDATE race_drivers SET name = $1 WHERE id = $2 RETURNING *;';
    const values = [name, id];
    try {
        const result = await db.query(query, values);
        if (result.rows.length === 0) {
            throw new Error(`Driver with ID ${id} not found`);
        }
        return result.rows[0];
    } catch (error) {
        throw new Error(`Database error: ${error.message}`);
    }
};

const deleteDriver = async (id) => {
    const query = 'DELETE FROM race_drivers WHERE id = $1 RETURNING *;';
    const values = [id];
    try {
        const result = await db.query(query, values);
        if (result.rows.length === 0) {
            throw new Error(`Driver with ID ${id} not found`);
        }
        return result.rows[0];
    } catch (error) {
        throw new Error(`Database error: ${error.message}`);
    }
};

module.exports = {
    addDriver,
    getDrivers,
    updateDriver,
    deleteDriver,
    getAvailableDrivers
};
