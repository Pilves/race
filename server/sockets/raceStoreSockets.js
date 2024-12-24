const raceStore = require('../store/raceStore');

module.exports = (io) => {

    raceStore.on('leaderboard', (leaderboard) => {
        console.log('Emitting leaderboardUpdated:', leaderboard);
        io.emit('leaderboardUpdated', {leaderboard});
    });

    raceStore.on('raceFlags', (flag) => {
        io.emit('flagUpdated', {flag});
    });

    raceStore.on('liveRace', (liveRace) => {
        io.emit('liveRace', liveRace);
    });

    raceStore.on('lapTimes', (lapTimes) => {
        io.emit('lapTimesUpdated', {lapTimes});
    });

    raceStore.on('lastSession', (session) => {
        io.emit('lastSessionUpdated', session);
    });

};