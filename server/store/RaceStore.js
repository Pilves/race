const EventEmitter = require('events');

class RaceStore extends EventEmitter {
    constructor() {
        super();
        this.state = {
            liveRace: null,
            lapTimes: [],
            leaderboard: [],
            raceFlags: 'Safe',
            raceTimer: null,
            lastSession: null,
        };
    }

    updateState(key, value) {
        this.state[key] = value;
        this.emit(key, value);
    }

    setLiveRace(race) {
        this.updateState('liveRace', race);
    }

    setLastSession(session) {
        const lastSession = {
            ...session,
            leaderboard: [...this.state.leaderboard],
            lapTimes: [...this.state.lapTimes]
        };
        this.updateState('lastSession', lastSession);
    }

    updateLapTime(sessionId, carNumber, lapTime, lapNumber, timestamp) {
        const updatedLapTimes = [...this.state.lapTimes];
        updatedLapTimes.push({ sessionId, carNumber, lapTime, lapNumber, timestamp });

        this.updateState('lapTimes', updatedLapTimes);

        const leaderboard = this.calculateLeaderboard(updatedLapTimes);
        this.updateState('leaderboard', leaderboard);
        if (this.state.lastSession && this.state.lastSession.sessionId === sessionId) {
            const updatedLastSession = {
                ...this.state.lastSession,
                leaderboard,
                lapTimes: updatedLapTimes
            };
            this.updateState('lastSession', updatedLastSession);
        }
    }

    setRaceFlag(flag) {
        this.updateState('raceFlags', flag);
    }

    getRaceFlag() {
        return this.state.raceFlags;
    }

    clearSession() {
        if (this.state.liveRace) {
            this.setLastSession(this.state.liveRace);
        }
        this.setLiveRace(null);
        this.updateState('lapTimes', []);
        this.updateState('leaderboard', []);
    }

    calculateLeaderboard(lapTimes) {
        const leaderboard = lapTimes
            .reduce((acc, lap) => {
                const existing = acc.find((item) => item.carNumber === lap.carNumber);
                const lapTimeMs = this.parseInterval(lap.lapTime);

                if (!existing) {
                    const newEntry = {
                        carNumber: lap.carNumber,
                        driverName: lap.driverName,
                        fastestLap: lapTimeMs,
                        currentLap: lap.lapNumber,
                    };
                    acc.push(newEntry);
                } else {
                    existing.fastestLap = Math.min(existing.fastestLap, lapTimeMs);
                    existing.currentLap = Math.max(existing.currentLap, lap.lapNumber);
                }

                return acc;
            }, [])
            .sort((a, b) => a.fastestLap - b.fastestLap || b.currentLap - a.currentLap);

        return leaderboard.map((entry) => ({
            ...entry,
            fastest_lap: this.formatTime(entry.fastestLap),
        }));
    }

    parseInterval(interval) {
        const [mins, secs] = interval.split(':').map(parseFloat);
        return mins * 60 * 1000 + secs * 1000;
    }

    formatTime(ms) {
        const mins = Math.floor(ms / 60000);
        const secs = ((ms % 60000) / 1000).toFixed(3);
        return `${mins}:${secs.padStart(6, '0')}`;
    }
}

const raceStore = new RaceStore();
module.exports = raceStore;
