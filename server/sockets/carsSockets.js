const carService = require('../service/carService');

module.exports = (io, socket) => {

    const emitUpdatedCars = async () => {
        try {
            const cars = await carService.getCars();
            io.emit('carsUpdated', cars);
        } catch (error) {
            console.error('Error emitting updated cars:', error.message);
        }
    };

    socket.on('requestCars', async () => {
        try {
            const cars = await carService.getCars();
            socket.emit('carsUpdated', cars);
        } catch (error) {
            console.error('Error fetching cars for client:', error.message);
            socket.emit('error', {message: error.message});
        }
    });

    socket.on('addCar', async ({carNumber}) => {
        try {
            if (!carNumber) throw new Error('Car number is required');
            const newCar = await carService.addCar(carNumber);
            console.log('Car added:', newCar);
            await emitUpdatedCars();
        } catch (error) {
            console.error('Error adding car:', error.message);
            socket.emit('error', {message: error.message});
        }
    });

    socket.on('deleteCar', async ({carId}) => {
        try {
            await carService.deleteCar(carId);
            await emitUpdatedCars();
        } catch (error) {
            console.error('Error deleting car:', error.message);
            socket.emit('error', {message: error.message});
        }
    });

    socket.on('requestAvailableCars', async ({ sessionId }) => {
        try {
            const availableCars = await carService.getAvailableCars(sessionId);
            socket.emit('availableCarsUpdated', availableCars);
        } catch (error) {
            console.error('Error fetching available cars:', error.message);
            socket.emit('error', { message: error.message });
        }
    });

};
