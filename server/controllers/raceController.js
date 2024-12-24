const raceService = require('../service/raceService');
const CustomError = require('../middleware/customError');
const raceStore = require('../store/RaceStore');
const carService = require('../service/carService');
const driverService = require('../service/driverService');

const addRaceSessions = async (req, res, next) => {
    const {sessionName} = req.body;
    try {
        if (!sessionName || typeof sessionName !== 'string') {
            throw new CustomError(400, 'Session name is required and must be a string');
        }

        const newSession = await raceService.addRaceSession(sessionName);

        const sessions = await raceService.getRaceSessions();
        req.app.get('io').emit('raceSessionsUpdated', sessions);
        console.log('Emitting sessions:', sessions);

        const nextSession = await raceService.getNextRaceSession();
        req.app.get('io').emit('nextRaceDetails', nextSession);
        console.log('Emitting nextRaceDetails:', nextSession);

        res.status(201).json({message: 'Race session created successfully', session: newSession});
    } catch (error) {
        next(error);
    }
};

const getRaceSessions = async (req, res, next) => {
    try {
        const sessions = await raceService.getRaceSessions();
        res.status(200).json({sessions});
    } catch (error) {
        next(new CustomError(500, error.message));
    }
};

const updateRaceSessions = async (req, res, next) => {
    const {id} = req.params;
    const {sessionName} = req.body;

    try {
        if (!sessionName || typeof sessionName !== 'string') {
            throw new CustomError(400, 'Session name is required and must be a string');
        }

        const updatedSession = await raceService.updateRaceSession(id, sessionName);

        const sessions = await raceService.getRaceSessions();
        req.app.get('io').emit('raceSessionsUpdated', sessions);

        res.status(200).json({message: 'Race session updated successfully', session: updatedSession});
    } catch (error) {
        next(error);
    }
};

const deleteRaceSession = async (req, res, next) => {
    const {id} = req.params;
    try {
        if (!id || isNaN(id)) {
            throw new CustomError(400, 'Invalid race session ID');
        }

        const deletedRaceSession = await raceService.deleteRaceSession(id);

        const sessions = await raceService.getRaceSessions();
        req.app.get('io').emit('raceSessionsUpdated', sessions);

        const nextSession = await raceService.getNextRaceSession();
        req.app.get('io').emit('nextRaceDetails', nextSession);

        res.status(200).json({message: 'Race session deleted successfully', session: deletedRaceSession});
    } catch (error) {
        next(error);
    }
};

const getRaceMods = async (req, res, next) => {
    try {
        const raceMods = await raceService.getRaceMods();
        res.status(200).json({raceMods});
    } catch (error) {
        next(new CustomError(500, error.message));
    }
};

/**
 * Assigns a driver to a race session.
 *
 * This method handles the HTTP POST request to assign a driver to a racing session.
 * It validates the provided driverId, forwards the request to the service layer,
 * and returns a success response upon completion.
 *
 * @param req - Express request, containing:
 *   req.params - Parameters from the route, including the session ID (`id`).
 *   req.body - Request body containing the driver ID (`driverId`).
 * @param res - Express response for sending JSON responses.
 * @param next - Express next middleware function for error handling.
 *
 * @throws {CustomError} Throws a 400 error if `driverId` is not provided.
 * @returns {void} Responds with a 201 status code and a success message, including
 * the assignment details.
 */
const assignDriverToSession = async (req, res, next) => {
    const { id: sessionId } = req.params;
    const { driverId, carId } = req.body;

    try {
        const assignment = await raceService.assignDriverToSession(sessionId, driverId, carId);

        const availableCars = await carService.getAvailableCars(sessionId);
        req.app.get('io').emit('availableCarsUpdated', availableCars);

        const availableDrivers = await driverService.getAvailableDrivers(sessionId);
        req.app.get('io').emit('availableDriversUpdated', availableDrivers);

        res.status(201).json({ message: 'Driver assigned successfully', assignment });
    } catch (error) {
        console.error('Server: Error assigning driver to session:', error.message);
        next(error);
    }
};

/**
 * Retrieves the list of drivers assigned to a specific session.
 *
 * This method handles the HTTP GET request to fetch drivers for a session.
 * It forwards the request to the service layer and returns the list of drivers
 * assigned to the given session.
 *
 * @param req - Express request object, containing:
 *   -req.params - Parameters from the route, including the session ID (`id`).
 * @param res - Express response for sending JSON responses.
 * @param next - Express next middleware function for error handling.
 *
 * @returns {void} Responds with a 200 status code and the list of drivers assigned
 * to the session in JSON format.
 */
const getDriversForSession = async (req, res, next) => {
    const {id: sessionId} = req.params;

    try {
        const drivers = await raceService.getDriversForSession(sessionId);
        res.status(200).json({drivers});
    } catch (error) {
        next(error);
    }
}

/**
 * Removes a driver from a race session.
 *
 * This method handles the HTTP DELETE request to remove a driver from a session.
 * It forwards the request to the service layer and returns a success message upon completion.
 *
 * @param req - Express request, containing:
 *   -req.params - Parameters from the route, including the assignment ID (`assignmentId`).
 * @param res - Express response for sending JSON responses.
 * @param next - Express next middleware function for error handling.
 *
 * @returns {void} Responds with a 200 status code and a success message, including
 * the details of the removed assignment.
 */
const removeDriverFromSession = async (req, res, next) => {
    const {assignmentId} = req.params;

    try {
        const removedAssignment = await raceService.removeDriverFromSession(assignmentId);

        const sessions = await raceService.getRaceSessions();
        req.app.get('io').emit('raceSessionsUpdated', sessions);

        res.status(200).json({message: 'Driver removed successfully', removedAssignment});
    } catch (error) {
        next(error);
    }
};

const getNextRaceSession = async (req, res, next) => {
    try {
        const nextSession = await raceService.getNextRaceSession();
        res.status(200).json({nextSession});
    } catch (error) {
        next(error);
    }
}

const startRaceSession = async (req, res, next) => {
    const {id: sessionId} = req.params;
    const raceDuration = parseInt(process.env.RACE_DURATION_MINUTES) * 60 * 1000;

    let liveRace;
    try {
        console.log(`Starting race session with ID: ${sessionId}`);
        const updatedSession = await raceService.startRaceSession(sessionId);

        liveRace = {
            sessionId,
            mode: 'Safe',
            session: updatedSession,
            raceDuration,
            startTime: Date.now(),
        };

        raceStore.setLiveRace(liveRace);

        console.log('Race session started', updatedSession);
        req.app.get('io').emit('raceStarted', liveRace);

        setTimeout(async () => {
            console.log(`Timer expired for race session ${sessionId}`);
            const finishMode = await raceService.getModeByName('Finish');
            await raceService.setRaceMode(sessionId, finishMode.id);

            req.app.get('io').emit('raceFinished', {
                sessionId,
                mode: 'Finish',
            });

            raceStore.setLastSession(liveRace);
            raceStore.setLiveRace(null);

            const nextSession = await raceService.getNextRaceSession();
            req.app.get('io').emit('nextRaceDetails', nextSession);
        }, raceDuration);

        res.status(200).json({
            message: 'Race session started successfully',
            session: updatedSession,
        });
    } catch (error) {
        next(error);
    }
};

const getLiveRace = (req, res) => {
    const io = req.app.get('io');
    if (liveRace) {
        const elapsedTime = Date.now() - liveRace.startTime;
        const remainingTime = Math.max(liveRace.raceDuration - elapsedTime, 0);
        const currentLiveRace = {...liveRace, remainingTime};

        raceStore.setRaceTimer(remainingTime);

        io.emit('currentLiveRace', currentLiveRace);
        res.status(200).json(currentLiveRace);
    } else {
        io.emit('currentLiveRace', null);
        res.status(404).json({message: 'No live race session'});
    }
};

module.exports = {
    getRaceMods,
    addRaceSessions,
    getRaceSessions,
    updateRaceSessions,
    deleteRaceSession,
    assignDriverToSession,
    getDriversForSession,
    removeDriverFromSession,
    getNextRaceSession,
    startRaceSession,
    getLiveRace
};
