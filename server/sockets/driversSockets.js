const driverService = require('../service/driverService');

module.exports = (io, socket) => {
    const emitUpdatedDrivers = async () => {
        try {
            const drivers = await driverService.getDrivers();
            console.log('Emitting updated drivers:', drivers);
            io.emit('driversUpdated', drivers);
        } catch (error) {
            console.error('Error emitting updated drivers:', error.message);
        }
    };

    socket.on('requestDrivers', async () => {
        console.log('Client requested drivers list');
        try {
            const drivers = await driverService.getDrivers();
            console.log('Sending current drivers to client:', drivers);
            socket.emit('driversUpdated', drivers);
        } catch (error) {
            console.error('Error fetching drivers for client:', error.message);
            socket.emit('error', {message: error.message});
        }
    });

    socket.on('addDriver', async ({driverName}) => {
        try {
            console.log('Adding driver:', driverName);
            const newDriver = await driverService.addDriver(driverName);
            console.log('Driver added:', newDriver);
            await emitUpdatedDrivers();
        } catch (error) {
            console.error('Error adding driver:', error.message);
            socket.emit('error', {message: error.message});
        }
    });

    socket.on('editDriver', async ({driverId, newName}) => {
        try {
            console.log(`Editing driver ID ${driverId} with new name: ${newName}`);
            await driverService.updateDriver(driverId, newName);
            await emitUpdatedDrivers();
        } catch (error) {
            console.error('Error editing driver:', error.message);
            socket.emit('error', {message: error.message});
        }
    });

    socket.on('deleteDriver', async ({driverId}) => {
        try {
            console.log('Deleting driver with ID:', driverId);
            await driverService.deleteDriver(driverId);
            await emitUpdatedDrivers();
        } catch (error) {
            console.error('Error deleting driver:', error.message);
            socket.emit('error', {message: error.message});
        }
    });

    socket.on('requestAvailableDrivers', async ({sessionId}) => {
        try {
            const availableDrivers = await driverService.getAvailableDrivers(sessionId);
            socket.emit('availableDriversUpdated', availableDrivers);
        } catch (error) {
            socket.emit('error', {message: error.message});
        }
    });
};
