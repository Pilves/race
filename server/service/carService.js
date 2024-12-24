const carRepository = require('../repository/carRepository');
const CustomError = require('../middleware/customError');


const addCar = async (carNumber) => {
    if (!carNumber || isNaN(carNumber)) {
        throw new CustomError(400, 'Invalid car number');
    }

    
    const totalCars = await carRepository.getTotalCars();
    if (totalCars >= 8) {
        throw new CustomError(400, 'Maximum limit of 8 cars has been reached.')
    }
    const exists = await carRepository.carExists(carNumber);
    if (exists) {
        throw new CustomError(409, `Car with number ${carNumber} already exists`);
    }

    return await carRepository.addCar(carNumber);
}


const getCars = async () => {
    return await carRepository.getCars();
}

const getCarById = async (id) => {
    if (!id || isNaN(id)) {
        throw new CustomError(400, 'Invalid car ID');
    }

    const car = await carRepository.getCarByCarNumber(id);
    if (!car) {
        throw new CustomError(404, `Car with ID ${id} not found`);
    }

    return car;
}

const getCarByNumber = async (carNumber) => {
    if (!carNumber || isNaN(carNumber)) {
        throw new CustomError(400, 'Invalid car number');
    }

    const car = await carRepository.getCarByNumber(carNumber);
    if (!car) {
        throw new CustomError(404, `Car with number ${carNumber} not found`);
    }

    return car;
}

const getAvailableCars = async (sessionId) => {
    if (!sessionId || isNaN(sessionId)) {
        throw new CustomError(400, 'Invalid session ID');
    }

    return await carRepository.getAvailableCars(sessionId);
}

const updateCar = async (id, carNumber) => {
    if (!id || isNaN(id)) {
        throw new CustomError(400, 'Invalid car ID');
    }
    if (!carNumber || isNaN(carNumber)) {
        throw new CustomError(400, 'Invalid car number');
    }

    const exists = await carRepository.carExists(carNumber);
    if (exists && exists.id !== parseInt(id)) {
        throw new CustomError(409, `Car with number ${carNumber} already exists`);
    }

    const updatedCar = await carRepository.updateCar(id, carNumber);
    if (!updatedCar) {
        throw new CustomError(404, `Car with ID ${id} not found`);
    }
    return updatedCar;
}

const deleteCar = async (id) => {
    if (!id || isNaN(id)) {
        throw new CustomError(400, 'Invalid car ID');
    }

    const deletedCar = await carRepository.deleteCar(id);
    if (!deletedCar) {
        throw new CustomError(404, `Car with ID ${id} not found`);
    }
    return deletedCar;
}

module.exports = {
    addCar,
    getCars,
    getCarById,
    getCarByNumber,
    getAvailableCars,
    updateCar,
    deleteCar,
};
