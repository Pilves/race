import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRaceState } from '../../hooks/useRaceState';

const NextRace = () => {
    const { nextRace, isConnected } = useRaceState();
    const [isFullscreen, setIsFullscreen] = useState(false);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    if (!isConnected) {
        return (
            <div className="next-race-container">
                <motion.div
                    className="no-race-message"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    Connecting to race system...
                </motion.div>
            </div>
        );
    }

    return (
        <div className={`next-race-container ${isFullscreen ? 'fullscreen' : ''}`}>
            <AnimatePresence mode="wait">
                {nextRace ? (
                    <motion.div
                        className="next-race-content"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <div className="next-race-header">
                            <h1 className="next-race-title">{nextRace.session_name}</h1>
                            {nextRace.start_time && (
                                <div className="race-time">
                                    Starts at: {new Date(nextRace.start_time).toLocaleTimeString()}
                                </div>
                            )}
                        </div>

                        <div className="drivers-grid">
                            {nextRace.participants
                                .filter(p => p.driver_name)
                                .map((participant, index) => (
                                    <motion.div
                                        key={`${participant.driver_name}-${participant.car_number}`}
                                        className="driver-card"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <div className="car-number-badge">
                                            {participant.car_number}
                                        </div>
                                        <div className="driver-info">
                                            <div className="driver-name">
                                                {participant.driver_name}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                        </div>

                        {nextRace.participants.length > 0 && (
                            <motion.div
                                className="proceed-message"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                Drivers: Please proceed to the paddock
                            </motion.div>
                        )}
                    </motion.div>
                ) : (
                    <motion.div
                        className="no-race-message"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        No upcoming race session scheduled
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={toggleFullscreen}
                className="fullscreen-button"
            >
                {isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            </button>
        </div>
    );
};

export default NextRace;
