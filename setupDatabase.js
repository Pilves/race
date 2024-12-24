const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'beachside_racetrack',
    password: '123',
    port: 5432,
});

const setupDatabase = async () => {
    const schemaSQL = `
        CREATE TABLE IF NOT EXISTS race_drivers (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL UNIQUE
        );

        CREATE TABLE IF NOT EXISTS cars (
            car_number INT NOT NULL PRIMARY KEY
        );

        CREATE TABLE IF NOT EXISTS race_modes (
            id SERIAL PRIMARY KEY,
            mode_name VARCHAR(50) NOT NULL UNIQUE,
            display VARCHAR(255) NOT NULL
        );

        CREATE TABLE IF NOT EXISTS race_sessions (
            id SERIAL PRIMARY KEY,
            session_name VARCHAR(255) NOT NULL,
            mode_id INT REFERENCES race_modes (id)
        );

        CREATE TABLE IF NOT EXISTS driver_assignments (
            id SERIAL PRIMARY KEY,
            session_id INT NOT NULL REFERENCES race_sessions (id) ON DELETE CASCADE,
            driver_id INT NOT NULL REFERENCES race_drivers (id) ON DELETE CASCADE,
            car_number INT NOT NULL REFERENCES cars (car_number) ON DELETE CASCADE,
            UNIQUE (session_id, driver_id),
            UNIQUE (session_id, car_number)
        );

        CREATE TABLE IF NOT EXISTS lap_times (
            id SERIAL PRIMARY KEY,
            session_id INT NOT NULL REFERENCES race_sessions (id) ON DELETE CASCADE,
            car_number INT NOT NULL REFERENCES cars (car_number) ON DELETE CASCADE,
            lap_time INTERVAL NOT NULL,
            lap_number INT NOT NULL,
            timestamp TIMESTAMP NOT NULL
        );

        CREATE TABLE IF NOT EXISTS leaderboards (
            id SERIAL PRIMARY KEY,
            session_id INT NOT NULL REFERENCES race_sessions (id) ON DELETE CASCADE,
            car_number INT NOT NULL REFERENCES cars (car_number) ON DELETE CASCADE,
            fastest_lap INTERVAL,
            current_lap INT NOT NULL
        );

        INSERT INTO race_modes (mode_name, display)
        VALUES ('Safe', 'Solid Green'),
               ('Hazard', 'Solid Yellow'),
               ('Danger', 'Solid Red'),
               ('Finish', 'Chequered Black/White')
        ON CONFLICT (mode_name) DO NOTHING;

        INSERT INTO cars (car_number)
        VALUES (1), (2), (3), (4), (5), (6), (7), (8)
        ON CONFLICT (car_number) DO NOTHING;
    `;

    try {
        const client = await pool.connect();
        await client.query(schemaSQL);
        console.log('Database schema and initial data setup completed.');
        client.release();
    } catch (err) {
        console.error('Error setting up the database:', err.stack);
    } finally {
        pool.end();
    }
};

setupDatabase();
