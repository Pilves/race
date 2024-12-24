import React from 'react';
import {Route, Routes} from 'react-router-dom';
import FrontDesk from '../components/FrontDesk/FrontDesk';
import RaceControl from '../components/RaceControl/RaceControl.jsx';
import LapLineTracker from '../components/LapLineTracker/LapLineTracker';
import LeaderBoard from '../components/LeaderBoard/LeaderBoard';
import NextRace from '../components/NextRace/NextRace';
import RaceCountdown from '../components/RaceCountdown/RaceCountdown';
import RaceFlags from '../components/RaceFlags/RaceFlags';
import LandingPage from "../components/LandingPage/LandingPage.jsx";
import AuthGuard from "../views/authGuard.jsx";
import {SocketContext} from "../App.jsx";
import {socket} from '../App';

const AppRouter = () => {
    return (
        <SocketContext.Provider value={socket}>

                <Routes>
                    {/* Landing Page */}
                    <Route path="/" element={<LandingPage />} />

                    {/* Protected Routes */}
                    <Route
                        path="/front-desk"
                        element={
                            <AuthGuard keyType="receptionist">
                                <FrontDesk />
                            </AuthGuard>
                        }
                    />
                    <Route
                        path="/race-control"
                        element={
                            <AuthGuard keyType="safety">
                                <RaceControl />
                            </AuthGuard>
                        }
                    />
                    <Route
                        path="/lap-line-tracker"
                        element={
                            <AuthGuard keyType="observer">
                                <LapLineTracker />
                            </AuthGuard>
                        }
                    />

                    {/* Public Routes */}
                    <Route path="/leader-board" element={<LeaderBoard />} />
                    <Route path="/next-race" element={<NextRace />} />
                    <Route path="/countdown" element={<RaceCountdown />} />
                    <Route path="/flag" element={<RaceFlags />} />

                    {/* 404 Fallback */}
                    <Route path="*" element={<div>404 - Page Not Found</div>} />
                </Routes>

        </SocketContext.Provider>
    );

}

export default AppRouter;
