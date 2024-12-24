import { useState, useEffect } from 'react';
import { socket } from '@/App';

export const useRaceState = () => {
    const [raceMode, setRaceMode] = useState('Safe');
    const [remainingTime, setRemainingTime] = useState(null);
    const [liveRace, setLiveRace] = useState(null);
    const [nextRace, setNextRace] = useState(null);
    const [error, setError] = useState(null);
    const [isConnected, setIsConnected] = useState(socket.connected);

    useEffect(() => {
        const handleConnect = () => {
            setIsConnected(true);
            socket.emit('requestLiveRace');
            socket.emit('announceNextRace');
        };

        const handleDisconnect = () => {
            setIsConnected(false);
        };

        const handleLiveRace = (race) => {
            console.log('Live race update received:', race);
            if (!race) {
                setLiveRace(null);
                setRemainingTime(null);
                return;
            }

            setLiveRace(race);
            if (race.startTime && race.raceDuration) {
                const now = Date.now();
                const elapsed = now - race.startTime;
                const remaining = Math.max(race.raceDuration - elapsed, 0);
                setRemainingTime(Math.floor(remaining / 1000));
            }
        };

        const handleFlagUpdate = ({ flag }) => {
            console.log('Flag update received:', flag);
            setRaceMode(flag);
            if (flag === 'Finish') {
                setRemainingTime(0);
            }
        };

        const handleRaceFinished = ({ sessionId, mode }) => {
            console.log('Race finished event received:', { sessionId, mode });
            setRemainingTime(0);
            setRaceMode('Finish');
        };

        const handleSessionEnded = ({ sessionId }) => {
            console.log('Session ended event received:', sessionId);
            setLiveRace(null);
            setRemainingTime(null);
            setRaceMode('Danger');
        };

        const handleNextRace = (race) => {
            console.log('Next race update received:', race);
            setNextRace(race);
        };

        socket.on('connect', handleConnect);
        socket.on('disconnect', handleDisconnect);
        socket.on('liveRace', handleLiveRace);
        socket.on('flagUpdated', handleFlagUpdate);
        socket.on('raceFinished', handleRaceFinished);
        socket.on('sessionEnded', handleSessionEnded);
        socket.on('nextRaceDetails', handleNextRace);

        if (socket.connected) {
            handleConnect();
        }

        return () => {
            socket.off('connect', handleConnect);
            socket.off('disconnect', handleDisconnect);
            socket.off('liveRace', handleLiveRace);
            socket.off('flagUpdated', handleFlagUpdate);
            socket.off('raceFinished', handleRaceFinished);
            socket.off('sessionEnded', handleSessionEnded);
            socket.off('nextRaceDetails', handleNextRace);
        };
    }, []);

    // Timer effect
    useEffect(() => {
        let interval;
        if (remainingTime > 0 && raceMode !== 'Finish') {
            interval = setInterval(() => {
                setRemainingTime((prev) => {
                    const newTime = Math.max(prev - 1, 0);
                    if (newTime === 0 && liveRace) {
                        console.log('Timer reached zero, emitting finish mode');
                        socket.emit('changeRaceMode', {
                            sessionId: liveRace.sessionId,
                            modeName: 'Finish'
                        });
                    }
                    return newTime;
                });
            }, 1000);
        } else if (remainingTime === 0 && liveRace && raceMode !== 'Finish') {
            console.log('Timer is zero, setting finish mode');
            socket.emit('changeRaceMode', {
                sessionId: liveRace.sessionId,
                modeName: 'Finish'
            });
        }

        return () => clearInterval(interval);
    }, [remainingTime, raceMode, liveRace]);

    return {
        raceMode,
        remainingTime,
        liveRace,
        nextRace,
        error,
        setError,
        isConnected
    };
};
