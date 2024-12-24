import React, {useEffect} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRaceState } from '../../hooks/useRaceState';
import { useRaceActions } from '../../hooks/useRaceActions';
import { formatTime } from '../../utils/timeUtils';
import {socket} from "@/App.jsx";

const RaceControl = () => {
    const {
        raceMode,
        remainingTime,
        liveRace,
        nextRace,
        error,
        setError,
        isConnected
    } = useRaceState();

    const { handleModeChange, handleStartRace, handleEndSession } = useRaceActions();

    useEffect(() => {
        if (raceMode === 'Finish' && liveRace) {
            socket.emit('changeRaceMode', {
                sessionId: liveRace.sessionId,
                modeName: 'Finish'
            });
        }
    }, [raceMode, liveRace]);

    const onModeChange = async (mode) => {
        try {
            if (raceMode === 'Finish' && mode !== 'Finish') {
                throw new Error('Cannot change mode after race is finished');
            }
            await handleModeChange(mode, liveRace, raceMode);

            // If changing to Finish mode, ensure timer stops
            if (mode === 'Finish') {
                socket.emit('raceFinished', {
                    sessionId: liveRace.sessionId,
                    mode: 'Finish'
                });
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const onStartRace = async () => {
        try {
            if (!nextRace) {
                throw new Error('No race session available to start');
            }
            if (!nextRace.participants || nextRace.participants.length === 0) {
                throw new Error('Cannot start race with no participants');
            }

            await handleStartRace(nextRace);

        } catch (err) {
            console.error('Error starting race:', err);
            setError(err.message);
        }
    };

    const onEndSession = async () => {
        try {
            if (!liveRace) {
                throw new Error('No active race session to end');
            }
            if (raceMode !== 'Finish') {
                throw new Error('Race must be in Finish mode to end session');
            }

            await handleEndSession(liveRace.sessionId);

            socket.emit('endRaceSession', {
                sessionId: liveRace.sessionId
            });
        } catch (err) {
            setError(err.message);
        }
    };

    if (!isConnected) {
        return (
            <div className="race-control-container">
                <motion.div
                    className="control-panel"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <div className="race-status-indicator">
                        <span className="status-icon">⚠️</span>
                        <span>Connecting to race control system...</span>
                    </div>
                </motion.div>
            </div>
        );
    }

    const showRaceControls = liveRace !== null;
    const showStartRace = !showRaceControls && nextRace;

    return (
        <div className="race-control-container">
            <div className="race-control-header">
                <div className="header-content">
                    <h1 className="race-control-title">Race Control Panel</h1>
                    <div className="race-status-indicator">
                        <span className="status-icon">🏁</span>
                        <span>
                            {showRaceControls ? (
                                raceMode === 'Finish' ? 'Race Finishing' : 'Race in Progress'
                            ) : 'Waiting for Race'}
                        </span>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {error && (
                    <motion.div
                        className="error-banner"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setError(null)}
                    >
                        {error}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="control-panels">
                {showRaceControls && (
                    <>
                        <div className="control-panel">
                            <h2 className="session-name">
                                Session: {liveRace.session?.session_name || 'Current Race'}
                            </h2>
                            <div className="race-timer-container">
                                <div className={`race-timer ${remainingTime <= 30 ? 'timer-warning' : ''}`}>
                                    {formatTime(remainingTime)}
                                </div>
                            </div>
                        </div>

                        <div className="control-panel">
                            <div className="race-mode-buttons">
                                <button
                                    className="mode-button mode-safe"
                                    onClick={() => onModeChange('Safe')}
                                    disabled={raceMode === 'Finish'}
                                >
                                    Safe
                                </button>
                                <button
                                    className="mode-button mode-hazard"
                                    onClick={() => onModeChange('Hazard')}
                                    disabled={raceMode === 'Finish'}
                                >
                                    Hazard
                                </button>
                                <button
                                    className="mode-button mode-danger"
                                    onClick={() => onModeChange('Danger')}
                                    disabled={raceMode === 'Finish'}
                                >
                                    Danger
                                </button>
                                <button
                                    className="mode-button mode-finish"
                                    onClick={() => onModeChange('Finish')}
                                    disabled={raceMode === 'Finish'}
                                >
                                    Finish
                                </button>
                            </div>

                            {raceMode === 'Finish' && (
                                <button
                                    className="mode-button mode-finish"
                                    onClick={onEndSession}
                                >
                                    Confirm All Cars in Pit Lane & End Session
                                </button>
                            )}
                        </div>
                    </>
                )}

                {showStartRace && (
                    <div className="control-panel">
                        <h2 className="race-control-title">
                            Next Race: {nextRace.session_name}
                        </h2>
                        <button
                            className="mode-button mode-safe"
                            onClick={onStartRace}
                        >
                            Start Next Race
                        </button>
                        <div className="driver-grid">
                            {nextRace.participants?.map((driver) => (
                                <div key={driver.id} className="driver-row">
                                    <span>#{driver.car_number}</span>
                                    <span>{driver.driver_name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RaceControl;
