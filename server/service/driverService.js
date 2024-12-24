const driverRepository = require('../repository/driverRepository');
const CustomError = require('../middleware/customError');

const addDriver = async (name) => {
    if (!name || typeof name !== 'string') {
        throw new Error('Invalid driver name');
    }

    return await driverRepository.addDriver(name);
};

const getDrivers = async () => {
    return await driverRepository.getDrivers();
}

const getAvailableDrivers = async (sessionId) => {
    if (!sessionId || isNaN(sessionId)) {
        throw new CustomError(400, 'Invalid session ID');
    }

    return await driverRepository.getAvailableDrivers(sessionId);
}

const updateDriver = async (id, name) => {
    if (!id || isNaN(id)) {
        throw new CustomError(400, 'Invalid driver ID');
    }

    const updatedDriver = await driverRepository.updateDriver(id, name);
    if (!updatedDriver) {
        throw new CustomError(404, `Driver with ID ${id} not found`);
    }

    return updatedDriver;
};

const deleteDriver = async (id) => {
    if (!id || isNaN(id)) {
        throw new Error('Invalid driver ID');
    }

    return await driverRepository.deleteDriver(id);
};

module.exports = {
    addDriver,
    getDrivers,
    updateDriver,
    deleteDriver,
    getAvailableDrivers
};
