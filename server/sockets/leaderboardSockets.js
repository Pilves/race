const raceStore = require('../store/raceStore');
const lapService = require('../service/lapService');
const leaderboardRepository = require('../repository/leaderboardRepository');

module.exports = (io, socket) => {
    socket.emit('liveRace', raceStore.state.liveRace);
    socket.emit('leaderboardUpdated', {leaderboard: raceStore.state.leaderboard});
    socket.emit('flagUpdated', {flag: raceStore.state.raceFlags});
    socket.emit('lapTimesUpdated', {lapTimes: raceStore.state.lapTimes});
    socket.on('requestLeaderboard', () => {
        console.log('Leaderboard request received');

        socket.emit('leaderboardUpdated', { leaderboard: raceStore.state.leaderboard });
    });




    socket.on('recordLap', async (lapData) => {
        console.log('Received recordLap event:', lapData);
        try {
            const { sessionId, car_number, lap_time, lap_number, timestamp, driver_name } = lapData;

            if (!sessionId || isNaN(sessionId)) {
                throw new Error('Invalid session ID.');
            }
            if (!car_number || isNaN(car_number)) {
                throw new Error('Invalid car ID.');
            }
            if (!lap_time) {
                throw new Error('Lap time is required.');
            }
            if (!lap_number || isNaN(lap_number)) {
                throw new Error('Lap number must be a valid number.');
            }
            if (!timestamp) {
                throw new Error('Timestamp is required.');
            }

            const newLap = await lapService.recordLapTime(sessionId, car_number, lap_time, lap_number, timestamp);

            const lapTimes = await lapService.getLapTimes(sessionId);
            const leaderboard = await leaderboardRepository.getLeaderboard(sessionId);

            raceStore.updateState('lapTimes', lapTimes);
            raceStore.updateState('leaderboard', leaderboard);

        } catch (error) {
            console.error('Error recording lap:', error.message);
            socket.emit('error', { message: error.message });
        }
    });

};
