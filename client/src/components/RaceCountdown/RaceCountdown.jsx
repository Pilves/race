import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRaceState } from '../../hooks/useRaceState';
import { formatTime } from '../../utils/timeUtils';

const CountdownDisplay = ({ remainingTime, status }) => (
    <motion.div
        className="countdown-display"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
    >
        <motion.div
            className="countdown-time"
            key={remainingTime}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
            {formatTime(remainingTime)}
        </motion.div>

        <motion.div
            className={`race-status status-${status}`}
            key={status}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
        >
            {status === 'waiting' && 'Waiting for Race'}
            {status === 'active' && 'Race in Progress'}
            {status === 'finish' && 'Race Complete'}
        </motion.div>
    </motion.div>
);

const NoRaceDisplay = () => (
    <motion.div
        className="no-race-message"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
    >
        No Active Race
    </motion.div>
);

const FullscreenButton = ({ isFullscreen, onToggle }) => (
    <button
        onClick={onToggle}
        className="fullscreen-button"
    >
        {isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
    </button>
);

export const RaceCountdown = () => {
    const { remainingTime, liveRace, isConnected } = useRaceState();
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

    const getRaceStatus = () => {
        if (!liveRace) return 'waiting';
        if (remainingTime <= 0) return 'finished';
        return 'active';
    };

    if (!isConnected) {
        return (
            <div className="countdown-container loading">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    Connecting to server...
                </motion.div>
            </div>
        );
    }

    const status = getRaceStatus();

    return (
        <div className={`countdown-container ${isFullscreen ? 'fullscreen' : ''}`}>
            <AnimatePresence mode="wait">
                {liveRace ? (
                    <CountdownDisplay
                        remainingTime={remainingTime}
                        status={status}
                    />
                ) : (
                    <NoRaceDisplay />
                )}
            </AnimatePresence>
            <FullscreenButton
                isFullscreen={isFullscreen}
                onToggle={toggleFullscreen}
            />
        </div>
    );
};

export default RaceCountdown;
