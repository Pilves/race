import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRaceState } from '../../hooks/useRaceState';

const CheckeredFlag = () => {
    const rows = 8;
    const cols = 8;
    const squares = [];

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const isBlack = (row + col) % 2 === 0;
            squares.push(
                <motion.div
                    key={`${row}-${col}`}
                    className="checkered-square"
                    style={{
                        backgroundColor: isBlack ? 'black' : 'white',
                        gridRow: row + 1,
                        gridColumn: col + 1
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                        delay: (row * cols + col) * 0.01,
                        duration: 0.2
                    }}
                />
            );
        }
    }

    return (
        <motion.div
            className="flag-display checkered-flag"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            {squares}
        </motion.div>
    );
};

const SolidFlag = ({color}) => (
    <motion.div
        className="flag-display solid-flag"
        style={{backgroundColor: color}}
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        exit={{opacity: 0}}
    />
);

const RaceFlag = () => {
    const {raceMode, isConnected} = useRaceState();
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        console.log('Current race mode:', raceMode); // Debug log
    }, [raceMode]);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    const getFlagColor = () => {
        // Convert to lowercase for consistent comparison
        switch (raceMode?.toLowerCase()) {
            case 'safe':
                return '#22c55e';
            case 'hazard':
                return '#eab308';
            case 'danger':
                return '#ef4444';
            case 'finish':
                return null;
            default:
                console.log('Unknown flag state:', raceMode);
                return '#6b7280';
        }
    };

    if (!isConnected) {
        return <div className="race-flag-container">Connecting...</div>;
    }

    const isCheckered = raceMode?.toLowerCase() === 'finish' ||
        raceMode?.toLowerCase() === 'checkered';

    return (
        <div className={`race-flag-container ${isFullscreen ? 'fullscreen' : ''}`}>
            <AnimatePresence mode="wait">
                {isCheckered ? (
                    <React.Fragment key="checkered-group">
                        <CheckeredFlag />
                        <motion.div
                            className="flag-text"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            {raceMode?.toUpperCase()}
                        </motion.div>
                    </React.Fragment>
                ) : (
                    <React.Fragment key="solid-group">
                        <SolidFlag color={getFlagColor()} />
                        <motion.div
                            className="flag-text"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            {raceMode?.toUpperCase()}
                        </motion.div>
                    </React.Fragment>
                )}
            </AnimatePresence>
            <button onClick={toggleFullscreen} className="fullscreen-button">
                {isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            </button>
        </div>
    );
};

export default RaceFlag;
