const driverService = require('../service/driverService');
const CustomError = require('../middleware/customError');

const addDriver = async (req, res, next) => {
    const {name} = req.body;
    try {
        if (!name) {
            throw new CustomError(400, 'Driver name is required');
        }
        const newDriver = await driverService.addDriver(name);

        const drivers = await driverService.getDrivers();
        req.app.get('io').emit('driversUpdated', drivers);

        res.status(201).json({message: 'Driver added successfully', driver: newDriver});
    } catch (error) {
        next(error);
    }
};

const getDrivers = async (req, res, next) => {
    try {
        const drivers = await driverService.getDrivers();
        res.status(200).json({drivers});
    } catch (error) {
        next(new CustomError(500, error.message));
    }
};

const getAvailableDrivers = async (req, res, next) => {
    const {sessionId} = req.params;
    try {
        const availableDrivers = await driverService.getAvailableDrivers(sessionId);
        req.app.get('io').emit('availableCarsUpdated', {sessionId, availableDrivers});
        res.status(200).json({availableDrivers});
    } catch (error) {
        next(new CustomError(500, error.message));
    }
};

const updateDriver = async (req, res, next) => {
    const {id} = req.params;
    const {name} = req.body;

    try {
        if (!name) {
            throw new CustomError(400, 'Driver name is required');
        }
        const updatedDriver = await driverService.updateDriver(id, name);

        const drivers = await driverService.getDrivers();
        req.app.get('io').emit('driversUpdated', drivers);

        res.status(200).json({message: 'Driver updated successfully', driver: updatedDriver});
    } catch (error) {
        next(error);
    }
};

const deleteDriver = async (req, res, next) => {
    const {id} = req.params;

    try {
        const deletedDriver = await driverService.deleteDriver(id);
        res.status(200).json({message: 'Driver deleted successfully', driver: deletedDriver});
    } catch (error) {
        next(new CustomError(500, error.message));
    }
}

module.exports = {
    addDriver,
    getDrivers,
    updateDriver,
    deleteDriver,
    getAvailableDrivers
};
