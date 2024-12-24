const db = require('../configuration/db');

const MAX_CARS = 8;

const addCar = async (carNumber) => {

    const totalCars = await getTotalCars();
    if (totalCars >= MAX_CARS){
        throw new Error(`Cannot add more cars. Max limit of ${MAX_CARS} cars has been reached`);
    }

    const query = 'INSERT INTO cars (car_number) VALUES ($1) RETURNING *;';
    const values = [carNumber];
    try {
        const result = await db.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw new Error(`Database error: ${error.message}`);
    }
};

const getCars = async () => {
    const query = 'SELECT * FROM cars ORDER BY car_number;';
    try {
        const result = await db.query(query);
        return result.rows;
    } catch (error) {
        throw new Error(`Database error: ${error.message}`);
    }
};

const getCarByCarNumber = async (car_number) => {
    const query = ' SELECT * FROM cars WHERE car_number = $1;';
    const values = [car_number];
    try {
        const result = await db.query(query, values);
        if (result.rows.length === 0) {
            throw new Error(`Car with number ${car_number} not found`);
        }
        return result.rows[0];
    } catch (error) {
        throw new Error(`Database error: ${error.message}`);
    }
};

const getCarByNumber = async (carNumber) => {
    const query = 'SELECT * FROM cars WHERE car_number = $1;';
    const values = [carNumber];
    try {
        const result = await db.query(query, values);
        if (result.rows.length === 0) {
            throw new Error(`Car with number ${carNumber} not found`);
        }
        return result.rows[0];
    } catch (error) {
        throw new Error(`Database error: ${error.message}`);
    }
};

const getAvailableCars = async (sessionId) => {
    const query = `
        SELECT c.* 
        FROM cars c
        WHERE NOT EXISTS (
            SELECT 1 
            FROM driver_assignments da 
            WHERE da.car_number = c.car_number 
            AND da.session_id = $1
        )
        ORDER BY c.car_number;
    `;
    const values = [sessionId];
    try {
        const result = await db.query(query, values);
        return result.rows;
    } catch (error) {
        throw new Error(`Database error: ${error.message}`);
    }
};

const updateCar = async (id, name) => {
    const query = 'UPDATE cars SET car_number = $2 WHERE id = $1 RETURNING id, car_number;';
    const values = [id, name];
    try {
        const result = await db.query(query, values);
        if (result.rows.length === 0) {
            throw new Error(`Car with ID ${id} not found`);
        }
        return result.rows[0];
    } catch (error) {
        throw new Error(`Database error: ${error.message}`);
    }
};

const deleteCar = async (id) => {
    const query = 'DELETE  FROM cars WHERE id = $1 RETURNING *;';
    const values = [id];
    try {
        const result = await db.query(query, values);
        if (result.rows.length === 0) {
            throw new Error(`Car with ID ${id} not found`);
        }
        return result.rows[0];
    } catch (error) {
        throw new Error(`Database error: ${error.message}`);
    }
};

const carExists = async (carNumber) => {
    const query = 'SELECT EXISTS(SELECT 1 FROM cars WHERE car_number = $1) as exists;';
    const values = [carNumber];
    try {
        const result = await db.query(query, values);
        return result.rows[0].exists;
    } catch (error) {
        throw new Error(`Database error: ${error.message}`);
    }
};

const getTotalCars = async () => {
    const query = 'SELECT COUNT(*) as total FROM cars;';
    try {
        const result = await db.query(query);
        return parseInt(result.rows[0].total);
    } catch (error) {
        throw new Error(`Database error: ${error.message}`);
    }
};

module.exports = {
    addCar,
    getCars,
    getCarByCarNumber: getCarByCarNumber,
    getCarByNumber,
    getAvailableCars,
    updateCar,
    deleteCar,
    carExists,
    getTotalCars,
};
