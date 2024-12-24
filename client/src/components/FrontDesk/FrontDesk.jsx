import React, { useState, useEffect } from 'react';
import { socket, SocketContext } from '../../App';

export default function FrontDesk() {
    const [sessions, setSessions] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [cars, setCars] = useState([]);
    const [sessionName, setSessionName] = useState('');
    const [driverName, setDriverName] = useState('');
    const [editDriverId, setEditDriverId] = useState('');
    const [editDriverName, setEditDriverName] = useState('');
    const [selectedDriver, setSelectedDriver] = useState('');
    const [selectedSession, setSelectedSession] = useState('');
    const [selectedCar, setSelectedCar] = useState('');

    useEffect(() => {
        socket.emit('requestSessions');
        socket.emit('requestDrivers');
        socket.emit('requestCars');
        socket.emit('raceSessionsUpdated');

        socket.on('driversUpdated', setDrivers);
        socket.on('raceSessionsUpdated', (sessions) => {
            const filteredSessions = sessions.filter(
                (session) => session.mode_name !== 'Finish'
            );
            setSessions(filteredSessions);
        });
        socket.on('carsUpdated', setCars);
        socket.on('availableCarsUpdated', setCars);
        socket.on('availableDriversUpdated', setDrivers);

        return () => {
            socket.off('driversUpdated');
            socket.off('raceSessionsUpdated');
            socket.off('carsUpdated');
            socket.off('availableCarsUpdated');
            socket.off('availableDriversUpdated');
        };
    }, []);

    const fetchAvailableResources = (sessionId) => {
        if (sessionId) {
            socket.emit('requestAvailableCars', { sessionId });
            socket.emit('requestAvailableDrivers', { sessionId });
        }
    };

    const clearSelection = () => {
        setSelectedDriver('');
        setSelectedSession('');
        setSelectedCar('');
    };

    const addSession = () => {
        if (sessionName.trim()) {
            socket.emit('addSession', { sessionName });
            setSessionName('');
        }
    };

    const addDriver = () => {
        if (driverName.trim()) {
            socket.emit('addDriver', { driverName });
            setDriverName('');
        }
    };

    const handleEditDriver = () => {
        if (editDriverId && editDriverName.trim()) {
            socket.emit('editDriver', { driverId: editDriverId, newName: editDriverName });
            setEditDriverId('');
            setEditDriverName('');
        }
    };

    const deleteDriver = (id) => {
        if (window.confirm('Are you sure you want to delete this driver?')) {
            socket.emit('deleteDriver', { driverId: id });
        }
    };

    const deleteSession = (sessionId) => {
        if (window.confirm('Are you sure you want to delete this session?')) {
            socket.emit('deleteSession', { sessionId });
        }
    };

    const assignDriverToSession = () => {
        if (!selectedSession || !selectedDriver) {
            alert('Please select both a session and a driver.');
            return;
        }

        socket.emit('assignDriverToSession', {
            driverId: selectedDriver,
            sessionId: selectedSession,
            carNumber: selectedCar || null,
        });

        clearSelection();
        fetchAvailableResources(selectedSession);
    };

    return (
        <SocketContext.Provider value={socket}>
            <div className="front-desk-container">
                {/* Header */}
                <header className="front-desk-header">
                    <h1 className="front-desk-title">Front Desk Management</h1>
                </header>

                {/* Register Drivers */}
                <div className="new-session-form">
                    <h2>Register Drivers</h2>
                    <form className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Driver Name:</label>
                            <input
                                className="form-input"
                                type="text"
                                value={driverName}
                                onChange={(e) => setDriverName(e.target.value)}
                                placeholder="Enter driver name"
                            />
                        </div>
                        <button type="button" className="add-driver" onClick={addDriver}>Add Driver</button>
                    </form>
                    <ul className="driver-list">
                        {drivers.map((driver) => (
                            <li key={driver.id} className="driver-item">
                                {driver.name}
                                <button
                                    className="remove-driver"
                                    onClick={() => deleteDriver(driver.id)}
                                >
                                    ✕
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Edit Driver */}
                <div className="new-session-form">
                    <h2>Edit Driver</h2>
                    <form className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Select Driver:</label>
                            <select
                                className="car-select"
                                value={editDriverId}
                                onChange={(e) => setEditDriverId(e.target.value)}
                            >
                                <option value="" disabled>Select a driver</option>
                                {drivers.map((driver) => (
                                    <option key={driver.id} value={driver.id}>{driver.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">New Name:</label>
                            <input
                                className="form-input"
                                type="text"
                                value={editDriverName}
                                onChange={(e) => setEditDriverName(e.target.value)}
                                placeholder="Enter new name"
                            />
                        </div>

                        <button type="button" className="add-driver" onClick={handleEditDriver}>Edit Driver</button>
                    </form>
                </div>

                {/* Create Race Session */}
                <div className="new-session-form">
                    <h2>Create Race Session</h2>
                    <form className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Session Name:</label>
                            <input
                                className="form-input"
                                type="text"
                                value={sessionName}
                                onChange={(e) => setSessionName(e.target.value)}
                                placeholder="Enter session name"
                            />
                        </div>
                        <button type="button" className="add-driver" onClick={addSession}>Add Session</button>
                    </form>
                </div>

                {/* Assign Drivers */}
                <div className="new-session-form">
                    <h2>Assign Drivers to Race</h2>
                    <form className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Select Session:</label>
                            <select
                                className="car-select"
                                value={selectedSession}
                                onChange={(e) => {
                                    const sessionId = e.target.value;
                                    setSelectedSession(sessionId);
                                    fetchAvailableResources(sessionId);
                                }}
                            >
                                <option value="" disabled>Select a session</option>
                                {sessions.map((session) => (
                                    <option key={session.session_id} value={session.session_id}>
                                        {session.session_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Select Driver:</label>
                            <select
                                className="car-select"
                                value={selectedDriver}
                                onChange={(e) => setSelectedDriver(e.target.value)}
                                disabled={!selectedSession}
                            >
                                <option value="" disabled>Select a driver</option>
                                {drivers.map((driver) => (
                                    <option key={driver.id} value={driver.id}>
                                        {driver.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Select Car:</label>
                            <select
                                className="car-select"
                                value={selectedCar}
                                onChange={(e) => setSelectedCar(e.target.value)}
                                disabled={!selectedSession}
                            >
                                <option value="" disabled>Select a car</option>
                                {cars.map((car) => (
                                    <option key={car.car_number} value={car.car_number}>
                                        Car #{car.car_number}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button type="button" className="add-driver" onClick={assignDriverToSession}>Assign Driver</button>
                    </form>
                </div>

                {/* Table for All Upcoming Races */}
                <div className="new-session-form">
                    <h2>All Upcoming Races</h2>
                    {sessions.length > 0 ? (
                        <div className="sessions-grid">
                            {sessions.map((session) => (
                                <div key={session.session_id} className="session-card">
                                    <h3>{session.session_name}</h3>
                                    <div className="session-details">
                                        <strong>Participants:</strong>
                                        {session.participants?.length > 0 ? (
                                            <ul className="participant-list">
                                                {session.participants.map((p, index) => (
                                                    <li key={index}>
                                                        {p.driver_name} (Car #{p.car_number})
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p>No participants</p>
                                        )}
                                    </div>
                                    <button
                                        className="delete-session-button"
                                        onClick={() => deleteSession(session.session_id)}
                                    >
                                        Delete Session
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No upcoming races available.</p>
                    )}
                </div>
            </div>
        </SocketContext.Provider>
    );
}
