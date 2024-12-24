import { socket } from '../App';

export const useRaceActions = () => {
    const handleModeChange = (mode, liveRace, currentMode) => {
        if (!liveRace) {
            throw new Error('No active race session');
        }
        if (currentMode === 'Finish') {
            throw new Error('Cannot change mode after race is finished');
        }

        socket.emit('changeRaceMode', {
            sessionId: liveRace.sessionId,
            modeName: mode
        });
    };

    const handleStartRace = (nextRace) => {
        if (!nextRace) {
            throw new Error('No race session available to start');
        }
        socket.emit('startRace', { sessionId: nextRace.session_id });
    };

    const handleEndSession = (liveRace, currentMode) => {
        if (!liveRace) {
            throw new Error('No active race session to end');
        }
        if (currentMode !== 'Finish') {
            throw new Error('Race must be in Finish mode to end session');
        }
        socket.emit('endRaceSession', { sessionId: liveRace.sessionId });
    };

    return {
        handleModeChange,
        handleStartRace,
        handleEndSession
    };
};
