const express = require('express');
const socketIo = require('socket.io');
const http = require('http');
const { authorize } = require('./middleware/authMiddleware');
const cors = require('cors');
require('dotenv').config({
    path: process.env.NODE_ENV === 'development' ? '.env.development' : '.env',
});

function validateEnvVariables() {
    const requiredVars = ['RECEPTIONIST_KEY', 'SAFETY_KEY', 'OBSERVER_KEY'];
    const missingVars = requiredVars.filter((key) => !process.env[key]);

    if (missingVars.length > 0) {
        console.error(
            `Error: Missing required environment variables: ${missingVars.join(', ')}`
        );
        process.exit(1);
    }
}

validateEnvVariables();


console.log(`Environment: ${process.env.NODE_ENV}`);
console.log(`Race duration: ${process.env.RACE_DURATION_MINUTES}`);

const errorHandler = require('./middleware/errorHandler');
const db = require('./configuration/db');

const driverRoutes = require('./routes/driverRoutes');
const raceRoutes = require('./routes/raceRoutes');
const carRoutes = require('./routes/carRoutes');
const lapRoutes = require('./routes/lapRoutes');

const sessionSockets = require('./sockets/sessionSockets');
const driversSockets = require('./sockets/driversSockets');
const carsSockets = require('./sockets/carsSockets');
const leaderboardSockets = require('./sockets/leaderboardSockets');
const raceStoreSockets = require('./sockets/raceStoreSockets');

const app = express();
const server = http.createServer(app);

const allowedOrigins = ['http://localhost:5173', 'http://localhost:4173'];

const io = socketIo(server, {
    cors: {
        origin: allowedOrigins,
        methods: ['GET', 'POST'],
    }
});


app.set('io', io);

app.use(express.json());
app.use(errorHandler);

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.send();
});

app.post('/api/verify-key', async (req, res) => {


    const { key, keyType } = req.body;

    const keys = {
        receptionist: process.env.RECEPTIONIST_KEY,
        observer: process.env.OBSERVER_KEY,
        safety: process.env.SAFETY_KEY
    };


    if (!key || !keyType || !keys[keyType]) {
        return res.status(400).json({
            status: 'error',
            message: 'Invalid key or keyType'
        });
    }

    if (key === keys[keyType]) {
        return res.json({
            status: 'success',
            message: 'Access granted',
            valid: true,
            role: keyType
        });
    } else {
        return res.status(401).json({
            status: 'error',
            message: 'Invalid key'
        });
    }
});


app.get('/api', (req, res) => {
    res.json({ message: 'API is working!' });
});

app.use('/api/drivers', authorize('receptionist'), driverRoutes);
app.use('/api/races', authorize('safety'), raceRoutes);
app.use('/api/cars', authorize('receptionist'), carRoutes);
app.use('/api/laps', authorize('observer'), lapRoutes);

raceStoreSockets(io);

io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    sessionSockets(io, socket);
    driversSockets(io, socket);
    carsSockets(io, socket);
    leaderboardSockets(io, socket);


    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const port = process.env.PORT || 8080;
const timerDuration = process.env.NODE_ENV === 'development' ? 60 * 1000 : 10 * 60 * 1000;
server.listen(port, () => {
    console.log(`Server started on port ${port}`);


});
