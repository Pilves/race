const lapRepository = require('../repository/lapRepository');
const leaderboardRepository = require('../repository/leaderboardRepository');

const recordLapTime = async (sessionId, carId, lapTime, lapNumber, timestamp) => {
    console.log('recordLapTime called with:', { sessionId, carId, lapTime, lapNumber, timestamp });
    const newLap = await lapRepository.addLapTime(sessionId, carId, lapTime, lapNumber, timestamp);
    console.log('Lap added to database:', newLap);

    const fastestLaps = await lapRepository.getFastestLapTimes(sessionId);
    console.log('Retrieved fastest laps:', fastestLaps);

    await leaderboardRepository.updateLeaderboard(sessionId, fastestLaps);
    console.log('Leaderboard updated successfully.');

    return newLap;
};

const getLapTimes = async (sessionId) => {
    return await lapRepository.getLapTimes(sessionId);
};

module.exports = {
    recordLapTime,
    getLapTimes
}