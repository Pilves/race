import React, { useState, useEffect } from "react";
import { socket } from "@/App";
import { formatTime } from "../../utils/timeUtils";

export default function LeaderBoard() {
    const [remainingTime, setRemainingTime] = useState(null);
    const [leaderboard, setLeaderboard] = useState([]);
    const [lastSessionLeaderboard, setLastSessionLeaderboard] = useState([]);
    const [raceMode, setRaceMode] = useState("Safe");
    const [isLiveRace, setIsLiveRace] = useState(false);
    const [sessionInfo, setSessionInfo] = useState(null);

    useEffect(() => {
        socket.emit("requestLiveRace");
        socket.emit("requestLeaderboard");
        socket.emit("requestLastSession");

        socket.on("liveRace", (liveRace) => {
            setIsLiveRace(!!liveRace);
            if (liveRace) {
                setSessionInfo(liveRace.session);
                const elapsed = Date.now() - liveRace.startTime;
                const remaining = Math.max(liveRace.raceDuration - elapsed, 0);
                setRemainingTime(Math.floor(remaining / 1000));
            } else {
                setRemainingTime(null);
            }
        });

        socket.on("leaderboardUpdated", ({ leaderboard }) => {
            if (isLiveRace) {
                setLeaderboard(leaderboard);
            }
        });

        socket.on("flagUpdated", ({ flag }) => {
            setRaceMode(flag);
        });

        socket.on("lastSessionUpdated", (session) => {
            if (!isLiveRace && session) {
                setLastSessionLeaderboard(session.leaderboard || []);
                setSessionInfo(session);
            }
        });

        socket.on("raceStarted", () => {
            setLastSessionLeaderboard([]);
            setLeaderboard([]);
        });

        socket.on("raceFinished", () => {
            setLastSessionLeaderboard(leaderboard);
        });

        return () => {
            socket.off("liveRace");
            socket.off("leaderboardUpdated");
            socket.off("flagUpdated");
            socket.off("lastSessionUpdated");
            socket.off("raceStarted");
            socket.off("raceFinished");
        };
    }, [isLiveRace, leaderboard]);

    const currentLeaderboard = isLiveRace ? leaderboard : lastSessionLeaderboard;
    const isFinished = raceMode === "Finish";

    return (
        <div className="leaderboard-container">
            {/* Session Info */}
            <div className="session-info">
                <h2>{isLiveRace ? "Live Race" : "Last Session"}</h2>
                {sessionInfo && <h3>{sessionInfo.session_name}</h3>}
            </div>

            {/* Timer */}
            {isLiveRace && (
                <div className="race-timer">
                    <h3>Remaining Time:</h3>
                    <div className={remainingTime <= 30 ? "warning" : ""}>
                        {formatTime(remainingTime)}
                    </div>
                </div>
            )}

            {/* Race Status */}
            <div className={`race-status ${raceMode.toLowerCase()}`}>
                {raceMode.toUpperCase()}
            </div>

            {/* Leaderboard Table */}
            <div className="leaderboard-section">
                <h3 className="leaderboard-header">
                    {isLiveRace ? "Current Race" : "Last Race"} Leaderboard
                </h3>
                <table className="leaderboard-table">
                    <thead>
                    <tr>
                        <th>Position</th>
                        <th>Car #</th>
                        <th>Driver</th>
                        <th>Best Lap</th>
                        <th>Last Lap</th>
                        <th>Lap Count</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentLeaderboard.map((entry, index) => (
                        <tr key={`${entry.car_number}-${index}`}>
                            <td>{index + 1}</td>
                            <td>{entry.car_number}</td>
                            <td>{entry.driver_name}</td>
                            <td className="lap-time">{entry.fastest_lap}</td>
                            <td className="lap-time">{entry.current_lap_time}</td>
                            <td>{entry.current_lap}</td>
                        </tr>
                    ))}
                    {currentLeaderboard.length === 0 && (
                        <tr>
                            <td colSpan="6" className="no-data">
                                No lap times recorded
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {/* Session Status */}
            {!isLiveRace && lastSessionLeaderboard.length > 0 && (
                <div className="session-status">
                    <p>Last race session completed. Waiting for next race to start.</p>
                </div>
            )}
        </div>
    );
}
