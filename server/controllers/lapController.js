const lapService = require('../service/lapService');
const leaderboardService = require('../service/leaderboardService');
const CustomError = require('../middleware/customError');
const raceStore = require('../store/raceStore');

const recordLapTime = async (req, res, next) => {
    const {sessionId, carId, lapTime, lapNumber, timestamp} = req.body;

    try {
        if (!sessionId || isNaN(sessionId)) {
            throw new CustomError(400, 'Invalid race session ID.');
        }
        if (!carId || isNaN(carId)) {
            throw new CustomError(400, 'Invalid car ID.');
        }
        if (!lapTime) {
            throw new CustomError(400, 'Lap time is required.');
        }
        if (!lapNumber || isNaN(lapNumber)) {
            throw new CustomError(400, 'Lap number must be a valid number.');
        }
        if (!timestamp) {
            throw new CustomError(400, 'Timestamp is required.');
        }

        const newLap = await lapService.recordLapTime(sessionId, carId, lapTime, lapNumber, timestamp);

        raceStore.updateLapTime(sessionId, carId, lapTime, lapNumber, timestamp);

        const lapTimes = raceStore.state.lapTimes;
        const leaderboard = raceStore.state.leaderboard;

        console.log('Leaderboard before emitting:', leaderboard);

        const io = req.app.get('io');
        io.emit('lapTimesUpdated', {lapTimes});
        io.emit('leaderboardUpdated', {sessionId, leaderboard});

        res.status(201).json(newLap);
    } catch (error) {
        next(error);
    }
};

const getLeaderboard = async (req, res, next) => {
    const {sessionId} = req.params;
    try {
        const leaderboard = await leaderboardService.getLeaderboard(sessionId);
        res.status(200).json(leaderboard);
    } catch (error) {
        next(error);
    }
};

const updateRaceFlag = async (req, res, next) => {
    const {flag} = req.body;

    try {
        raceStore.setRaceFlag(flag);

        const io = req.app.get('io');
        io.emit('flagUpdated', {flag});

        res.status(200).send('Race flag updated.');
    } catch (error) {
        next(error);
    }
};

module.exports = {
    recordLapTime,
    getLeaderboard,
    updateRaceFlag
}