const raceRepository = require('../repository/raceRepository');
const CustomError = require('../middleware/customError');
const carRepository = require('../repository/carRepository');
const raceStore = require('../store/RaceStore');

const addRaceSession = async (sessionName) => {
  if (!sessionName || typeof sessionName !== 'string') {
      throw new CustomError(400, 'Invalid session name');
  }
  return await raceRepository.addRaceSession(sessionName);
};

const getRaceSessions = async () => {
    return await raceRepository.getRaceSessions();
}

const updateRaceSession = async (id, sessionName) => {
    if (!id || isNaN(id)) {
        throw new CustomError(400, 'Invalid session ID');
    }
    if (!sessionName || typeof sessionName !== 'string') {
        throw new CustomError(400, 'Invalid session name');
    }
    return await raceRepository.updateRaceSession(id, sessionName);
};

const deleteRaceSession = async (id) => {
    if (!id || isNaN(id)) {
        throw new CustomError(400, 'Invalid session ID');
    }
    return await raceRepository.deleteRaceSession(id);
};

const getRaceMods = async () => {
    return await raceRepository.getRaceMods();
}

/**
 * Assigns a driver to a session, optionally associating them with a specific car manually.
 *
 * This function validates the input parameters for the session, driver, and (optionally) car.
 * It ensures that the session and driver IDs are valid, checks the existence and availability
 * of the car (if provided), and assigns the driver to the session with the appropriate car.
 *
 * @param {number} sessionId - The unique identifier for the session. Must be a valid number.
 * @param {number} driverId - The unique identifier for the driver. Must be a valid number.
 * @param {number|null} [carId=null] - Optional. The unique identifier for the car to assign.
 * If not provided, the first available car for the session is automatically selected.
 *
 * @throws {CustomError} Throws a 400 error if:
 * - The sessionId or driverId is invalid (not a number or missing).
 * - The carId is provided but the car does not exist or is unavailable.
 * - No cars are available for the session when no carId is provided.
 *
 */
const assignDriverToSession = async (sessionId, driverId, carNumber = null) => {
    console.log('Service: Assigning driver with params:', { sessionId, driverId, carNumber });

    if (!sessionId || isNaN(sessionId)) {
        throw new CustomError(400, 'Invalid session ID');
    }
    if (!driverId || isNaN(driverId)) {
        throw new CustomError(400, 'Invalid driver ID');
    }

    let assignedCarId;
    if (carNumber) {
        const car = await carRepository.getCarByCarNumber(carNumber);
        if (!car) {
            throw new CustomError(400, `Car with ID ${carNumber} not found`);
        }

        const availableCars = await carRepository.getAvailableCars(sessionId);
        console.log('Service: Available cars before manual assignment:', availableCars);

        const isCarAvailable = availableCars.some(car => car.car_number === parseInt(carNumber));
        if (!isCarAvailable) {
            throw new CustomError(400, `Car with ID ${carNumber} is already assigned`);
        }

        assignedCarId = carNumber;
    } else {
        const availableCars = await carRepository.getAvailableCars(sessionId);
        console.log('Service: Available cars before auto-assignment:', availableCars);

        if (availableCars.length === 0) {
            throw new CustomError(400, 'No available cars for this session');
        }

        assignedCarId = availableCars[0].car_number;
    }

    const result = await raceRepository.assignDriverToSession(sessionId, driverId, assignedCarId);
    console.log('Service: Assigned car ID:', assignedCarId);
    return result;
};


const getDriversForSession = async (sessionId) => {
    if (!sessionId || isNaN(sessionId)) {
        throw new CustomError(400, 'Invalid session ID');
    }

    return await raceRepository.getDriversForSession(sessionId);
};

const removeDriverFromSession = async (assignmentId) => {
    if (!assignmentId || isNaN(assignmentId)) {
        throw new CustomError(400, 'Invalid assignment ID');
    }

    return await raceRepository.removeDriverFromSession(assignmentId);
};

const getNextRaceSession = async () => {
    try {
        const session = await raceRepository.getNextRaceSession();
        console.log('Race Service: Retrieved session:', JSON.stringify(session, null, 2));
        return session;
    } catch (error) {
        console.error('Error in raceService.getNextRaceSession:', error.message);
        throw error;
    }
};


const startRaceSession = async (sessionId) => {
    if (!sessionId || isNaN(sessionId)) {
        throw new CustomError(400, 'Invalid session ID');
    }

    const currentMode = await raceRepository.getCurrentModeForSession(sessionId);
    if (currentMode && currentMode.mode_name === 'Finish') {
        throw new CustomError(400, 'Cannot start a session already in "Finished" mode');
    }

    const safeMode = await raceRepository.getModeByName('Safe');
    if (!safeMode) {
        throw new CustomError(500, 'Safe mode not found');
    }

    const session = await raceRepository.setRaceMode(sessionId, safeMode.id);
    raceStore.setLiveRace({sessionId, session, mode: 'Safe', startTime: Date.now()});
    return session;
};

const updateRaceMode = async (sessionId, modeName) => {
    if (!sessionId || isNaN(sessionId)) {
        throw new CustomError(400, 'Invalid session ID');
    }
    if (!modeName || typeof modeName !== 'string') {
        throw new CustomError(400, 'Invalid mode name');
    }

    const mode = await raceRepository.getModeByName(modeName);
    if (!mode) {
        throw new CustomError(404, `Mode "${modeName}" not found`);
    }
    await raceRepository.validateModeChange(sessionId, mode.id);
    return await raceRepository.setRaceMode(sessionId, mode.id);
};

const getModeByName = async (modeName) => {
    return await raceRepository.getModeByName(modeName);
};

const setRaceMode = async (sessionId, modeId) => {
    return await raceRepository.setRaceMode(sessionId, modeId);
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
    startRaceSession,
    getModeByName,
    setRaceMode,
    updateRaceMode
}
