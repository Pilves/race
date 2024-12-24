const raceService = require('../service/raceService');
const raceRepository = require('../repository/raceRepository');
const raceStore = require('../store/RaceStore');
const carService = require('../service/carService');
const driverService = require('../service/driverService');

module.exports = (io, socket) => {

    const sendInitialData = async () => {
        try {
            const sessions = await raceService.getRaceSessions();
            socket.emit('raceSessionsUpdated', sessions);

            const liveRace = raceStore.state.liveRace;
            if (liveRace) {
                const elapsedTime = Date.now() - liveRace.startTime;
                const remainingTime = Math.max(liveRace.raceDuration - elapsedTime, 0);
                socket.emit('liveRace', { ...liveRace, remainingTime });
            }



            const lapTimes = raceStore.state.lapTimes || [];
            socket.emit('lapTimesUpdated', { lapTimes });

            const raceFlags = raceStore.state.raceFlags || 'Safe';
            socket.emit('flagUpdated', { flag: raceFlags });

            const lastSession = raceStore.state.lastSession;
            if (lastSession) {
                socket.emit('lastSessionUpdated', lastSession);
            }
        } catch (error) {
            console.error('Error sending initial data:', error.message);
            socket.emit('error', { message: error.message });
        }
    };

    sendInitialData()
        .then(()=> console.log('Initial data sent successfully'))
        .catch((error) => console.error('Error in sendInitialData: ', error.message));

    socket.on('requestLiveRace', () => {
        console.log('Client requested live race data');
        const liveRace = raceStore.state.liveRace;
        if (liveRace) {
            const elapsedTime = Date.now() - liveRace.startTime;
            const remainingTime = Math.max(liveRace.raceDuration - elapsedTime, 0);
            socket.emit('liveRace', { ...liveRace, remainingTime });
        } else {
            console.log('No live race currently running');
            socket.emit('liveRace', null);
        }
    });

    const emitUpdatedSessions = async () => {
        try {
            const sessions = await raceService.getRaceSessions();
            io.emit('raceSessionsUpdated', sessions);
            console.log('Emitted updated sessions:', sessions);
        } catch (error) {
            console.error('Error emitting updated sessions:', error.message);
        }
    };

    const emitDriverAssignments = async (sessionId) => {
        try {
            const assignments = await raceRepository.getDriversForSession(sessionId);
            io.emit('driverAssignmentsUpdated', { sessionId, assignments });
        } catch (error) {
            console.error('Error emitting driver assignments:', error.message);
        }
    };

    socket.on('assignDriverToSession', async ({ sessionId, driverId, carNumber }) => {
        console.log('Received assignDriverToSession:', { sessionId, driverId, carNumber });
        try {
            if (!driverId || !sessionId) {
                throw new Error('Driver ID and Session ID are required');
            }

            const assignment = await raceService.assignDriverToSession(sessionId, driverId, carNumber || null);
            console.log('Driver assigned to session:', assignment);

            await emitDriverAssignments(sessionId);

            const sessions = await raceService.getRaceSessions();
            io.emit('raceSessionsUpdated', sessions);

            const nextSession = await raceService.getNextRaceSession();
            io.emit('nextRaceDetails', nextSession);

            const availableCars = await carService.getAvailableCars(sessionId);
            io.emit('availableCarsUpdated', availableCars);

            const availableDrivers = await driverService.getAvailableDrivers(sessionId);
            io.emit('availableDriversUpdated', availableDrivers);

        } catch (error) {
            console.error('Error assigning driver to session:', error.message);
            socket.emit('error', { message: error.message });
        }
    });

    socket.on('requestSessions', async () => {
        await sendInitialData();
    })
    socket.on('announceNextRace', async () => {
        try {
            const nextSession = await raceService.getNextRaceSession();
            io.emit('nextRaceDetails', nextSession || null);
        } catch (error) {
            console.error('Error in announceNextRace:', error.message);
            socket.emit('error', { message: error.message });
        }
    });

    socket.on('addSession', async ({ sessionName }) => {
        try {
            const newSession = await raceService.addRaceSession(sessionName);
            console.log('Session added:', newSession);
            await emitUpdatedSessions();
        } catch (error) {
            console.error('Error adding session:', error.message);
            socket.emit('error', { message: error.message });
        }
    });

    socket.on('updateSession', async ({ sessionId, sessionName }) => {
        try {
            const updatedSession = await raceService.updateRaceSession(sessionId, sessionName);
            console.log('Session updated:', updatedSession);
            await emitUpdatedSessions();
        } catch (error) {
            console.error('Error updating session:', error.message);
            socket.emit('error', { message: error.message });
        }
    });

    socket.on('deleteSession', async ({ sessionId }) => {
        try {
            const deletedSession = await raceService.deleteRaceSession(sessionId);
            console.log('Session deleted:', deletedSession);
            await emitUpdatedSessions();
        } catch (error) {
            console.error('Error deleting session:', error.message);
            socket.emit('error', { message: error.message });
        }
    });

    socket.on('startRace', async ({ sessionId }) => {
        try {
            const raceDuration = process.env.RACE_DURATION_MINUTES
                ? parseInt(process.env.RACE_DURATION_MINUTES) * 60 * 1000
                : 10 * 60 * 1000;

            const updatedSession = await raceService.startRaceSession(sessionId);
            const participants = await raceService.getDriversForSession(sessionId);

            const liveRace = {
                sessionId,
                mode: 'Safe',
                session: { ...updatedSession, participants },
                raceDuration,
                startTime: Date.now(),
            };

            // Update race store state
            raceStore.setLiveRace(liveRace);
            raceStore.setRaceFlag('Safe');

            // Emit initial race state to all clients
            io.emit('raceStarted', liveRace);
            io.emit('flagUpdated', { flag: 'Safe' });
            io.emit('liveRace', liveRace);

            // Update sessions and next race immediately
            await emitUpdatedSessions();
            const nextSession = await raceService.getNextRaceSession();
            io.emit('nextRaceDetails', nextSession);

            // Set timer for race finish
            setTimeout(async () => {
                try {
                    const finishMode = await raceService.getModeByName('Finish');
                    await raceService.setRaceMode(sessionId, finishMode.id);

                    // Emit race finish state
                    io.emit('raceFinished', { sessionId, mode: 'Finish' });
                    io.emit('flagUpdated', { flag: 'Finish' });

                    // Store last session before clearing live race
                    raceStore.setLastSession(liveRace);
                    raceStore.setLiveRace(null);
                    raceStore.setRaceFlag('Finish');

                    // Update sessions and next race again
                    await emitUpdatedSessions();
                    const nextSession = await raceService.getNextRaceSession();
                    io.emit('nextRaceDetails', nextSession);
                } catch (error) {
                    console.error('Error finishing race:', error.message);
                    socket.emit('error', { message: error.message });
                }
            }, raceDuration);

        } catch (error) {
            console.error('Error starting race:', error.message);
            socket.emit('error', { message: error.message });
        }
    });

    socket.on('endRaceSession', async ({ sessionId }) => {
        try {
            console.log('Ending race session:', sessionId);

            const currentMode = raceStore.getRaceFlag();
            if (currentMode !== 'Finish') {
                throw new Error('Cannot end session before race is finished');
            }

            const dangerMode = await raceService.getModeByName('Danger');
            await raceService.setRaceMode(sessionId, dangerMode.id);

            raceStore.setRaceFlag('Danger');
            raceStore.setLiveRace(null);

            io.emit('flagUpdated', { flag: 'Danger' });
            io.emit('liveRace', null);
            io.emit('sessionEnded', { sessionId });

            await emitUpdatedSessions();
            const nextSession = await raceService.getNextRaceSession();
            io.emit('nextRaceDetails', nextSession);

            console.log('Session ended successfully');
        } catch (error) {
            console.error('Error ending race session:', error.message);
            socket.emit('error', { message: error.message });
        }
    });

    socket.on('changeRaceMode', async ({ sessionId, modeName }) => {
        try {
            console.log('Changing race mode:', { sessionId, modeName });

            await raceService.updateRaceMode(sessionId, modeName);
            raceStore.setRaceFlag(modeName);

            io.emit('flagUpdated', { flag: modeName });

            if (modeName === 'Finish') {
                const liveRace = raceStore.state.liveRace;
                if (liveRace) {
                    console.log('Race finishing:', liveRace.sessionId);

                    raceStore.setLastSession({
                        ...liveRace,
                        mode: 'Finish'
                    });

                    raceStore.setLiveRace(null);

                    io.emit('raceFinished', { sessionId, mode: 'Finish' });
                    io.emit('liveRace', null);

                    await emitUpdatedSessions();
                }
            }
        } catch (error) {
            console.error('Error changing race mode:', error.message);
            socket.emit('error', { message: error.message });
        }
    });

    socket.on('setRaceMode', async ({ sessionId, modeName }) => {
        try {
            const mode = await raceService.getModeByName(modeName);
            await raceService.setRaceMode(sessionId, mode.id);

            console.log(`Race mode set to ${modeName} for session ${sessionId}`);
            raceStore.setRaceFlag(modeName);
            io.emit('flagUpdated', { flag: modeName });
        } catch (error) {
            console.error('Error setting race mode:', error.message);
            socket.emit('error', { message: error.message });
        }
    });

    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
};
