const leaderboardRepository = require('../repository/leaderboardRepository');

const getLeaderboard = async (sessionId) => {
    console.log('Fetching leaderboard for session:', sessionId);
    const leaderboard = await leaderboardRepository.getLeaderboard(sessionId);
    console.log('Retrieved leaderboard:', leaderboard);
    return leaderboard;
};


module.exports = {
    getLeaderboard,
};