import React, { useState, useEffect, useContext } from 'react';
import { socket, SocketContext } from '../../App';

const LapLineTracker = () => {
    const [sessions, setSessions] = useState([]);
    const [liveRace, setLiveRace] = useState(null);
    const [remainingTime, setRemainingTime] = useState(null);
    const [lapTimes, setLapTimes] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);
    const [raceFlag, setRaceFlag] = useState(null);

    useEffect(() => {
        socket.emit('requestLiveRace');
        socket.emit('announceNextRace');
        socket.emit('requestDrivers');
        socket.emit('requestCars');
        socket.emit('requestLapTimes');
        socket.emit('requestFlag');

        socket.on('liveRace', (liveRace) => {
            console.log('Live race updated:', liveRace);
            setLiveRace(liveRace);

            if (liveRace && liveRace.remainingTime !== undefined) {
                setRemainingTime(Math.floor(liveRace.remainingTime / 1000));
            } else {
                setRemainingTime(null);
            }
        });

        socket.on('raceStarted', (newRace) => {
            setLiveRace(newRace);
        });

        socket.on('leaderboardUpdated', ({ leaderboard }) => {
            setLeaderboard(leaderboard);
        });

        socket.on('lapTimesUpdated', ({ lapTimes }) => {
            const sortedLapTimes = lapTimes.sort((a, b) => {
                if (a.car_number === b.car_number) {
                    return a.lap_number - b.lap_number;
                }
                return a.car_number - b.car_number;
            });
            setLapTimes(sortedLapTimes);
        });

        socket.on('flagUpdated', ({ flag }) => {
            console.log('Race flag updated:', flag);
            setRaceFlag(flag);
        });

        socket.on('raceSessionsUpdated', (updatedSessions) => {
            const upcomingSessions = updatedSessions.filter((session) => session.mode_name !== 'Finish');
            setSessions(upcomingSessions);
        });

        socket.on('disconnect', () => {
            console.warn('Socket disconnected');
        });

        return () => {
            socket.off('liveRace');
            socket.off('leaderboardUpdated');
            socket.off('lapTimesUpdated');
            socket.off('flagUpdated');
            socket.off('raceSessionsUpdated');
            socket.off('raceStarted');
            socket.off('disconnect');
        };
    }, []);

    useEffect(() => {
        let interval;
        if (remainingTime > 0) {
            interval = setInterval(() => {
                setRemainingTime((prev) => Math.max(prev - 1, 0));
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [remainingTime]);

    const handleRecordLap = (sessionId, carNumber) => {
        if (!liveRace) {
            console.error('No live race to record laps for.');
            return;
        }

        const validLapTimes = Array.isArray(lapTimes) ? lapTimes : [];
        const lapTime = new Date();

        const previousLaps = validLapTimes
            .filter((lap) => lap.car_number === carNumber)
            .sort((a, b) => b.lap_number - a.lap_number);

        const previousLap = previousLaps[0];
        const previousLapTime = previousLap ? new Date(previousLap.timestamp) : new Date(liveRace.startTime);

        if (isNaN(previousLapTime.getTime())) {
            console.error('Invalid previous lap time.');
            return;
        }

        const lapDurationMs = lapTime - previousLapTime;
        const lapDuration = new Date(lapDurationMs).toISOString().substr(14, 9);
        const lapNumber = (previousLap?.lap_number || 0) + 1;

        const driverName = liveRace.session.participants.find(
            (p) => p.car_number === carNumber
        )?.driver_name || 'Unknown Driver';

        const newLap = {
            sessionId: liveRace.sessionId,
            car_number: carNumber,
            lap_time: lapDuration,
            lap_number: lapNumber,
            driver_name: driverName,
            timestamp: lapTime.toISOString(),
        };

        console.log('Recording lap:', newLap);

        setLapTimes((prev) => [...prev, newLap]);

        socket.emit('recordLap', newLap);
    };

    return (
        <SocketContext.Provider value={socket}>
            <div>
                {liveRace ? (
                    <div>
                        <div className="center-content">
                            <h3>Participants</h3>
                            <ul>
                                {liveRace.session && Array.isArray(liveRace.session.participants) ? (
                                    liveRace.session.participants.map((participant, index) => (
                                        <li key={index}>
                                            <strong>{participant.driver_name}</strong> - Car #{participant.car_number}
                                        </li>
                                    ))
                                ) : (
                                    <p>No participants available.</p>
                                )}
                            </ul>
                        </div>

                        <div>
                            <h3>Record Lap Times</h3>
                            <p>Tap the button when a car crosses the lap line.</p>
                            <div>
                                {raceFlag === 'Finish' ? (
                                    <p>Race has ended. Lap recording disabled.</p>
                                ) : (
                                    <div className="lap-buttons">
                                        {liveRace.session &&
                                        Array.isArray(liveRace.session.participants) ? (
                                            liveRace.session.participants.map((participant) => (
                                                <button
                                                    key={participant.car_number}
                                                    className="lap-button"
                                                    onClick={() =>
                                                        handleRecordLap(
                                                            liveRace.session.session_id,
                                                            participant.car_number
                                                        )
                                                    }
                                                    style={{
                                                        fontSize: '1.5rem',
                                                        padding: '15px',
                                                        margin: '10px',
                                                        backgroundColor: 'rgba(255,234,0,0.92)',
                                                        color: '#fff',
                                                        border: 'none',
                                                        borderRadius: '5px',
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    Car #{participant.car_number}
                                                </button>
                                            ))
                                        ) : (
                                            <p>No participants available to record laps.</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <p>No active race session.</p>
                )}
            </div>
        </SocketContext.Provider>
    );
};

export default LapLineTracker;
