const carService = require('../service/carService');
const CustomError = require('../middleware/customError');

const addCar = async (req, res, next) => {
    const {carNumber} = req.body;
    try {
        if (!carNumber) {
            throw new CustomError(400, 'Car number is required');
        }
        const newCar = await carService.addCar(carNumber);

        const cars = await carService.getCars();
        req.app.get('io').emit('carsUpdated', cars);

        res.status(201).json({message: 'Car added successfully', car: newCar});
    } catch (error) {
        next(error);
    }
};

const getCars = async (req, res, next) => {
    try {
        const cars = await carService.getCars();
        res.status(200).json({cars});
    } catch (error) {
        next(new CustomError(500, error.message));
    }
};

const getCarById = async (req, res, next) => {
    const {id} = req.params;
    try {
        const car = await carService.getCarById(id);
        res.status(200).json({car});
    } catch (error) {
        next(error);
    }
};

const getCarByNumber = async (req, res, next) => {
    const {carNumber} = req.params;
    try {
        const car = await carService.getCarByNumber(carNumber);
        res.status(200).json({car});
    } catch (error) {
        next(error);
    }
};

const getAvailableCars = async (req, res, next) => {
    const {sessionId} = req.params;
    try {
        const cars = await carService.getAvailableCars(sessionId);
        req.app.get('io').emit('availableCarsUpdated', {sessionId, cars});

        res.status(200).json({cars});
    } catch (error) {
        next(error);
    }
};

const updateCar = async (req, res, next) => {
    const {id} = req.params;
    const {carNumber} = req.body;

    try {
        if (!carNumber) {
            throw new CustomError(400, 'Car number is required');
        }
        const updatedCar = await carService.updateCar(id, carNumber);

        const cars = await carService.getCars();
        req.app.get('io').emit('carsUpdated', cars);

        res.status(200).json({message: 'Car updated successfully', car: updatedCar});
    } catch (error) {
        next(error);
    }
};

const deleteCar = async (req, res, next) => {
    const {id} = req.params;
    try {
        if (!id || isNaN(id)) {
            throw new CustomError(400, 'Invalid car ID');
        }

        await carService.deleteCar(id);

        const cars = await carService.getCars();
        req.app.get('io').emit('carsUpdated', cars);

        res.status(200).json({message: 'Car deleted successfully'});
    } catch (error) {
        next(error);
    }
};

module.exports = {
    addCar,
    getCars,
    getCarById,
    getCarByNumber,
    getAvailableCars,
    updateCar,
    deleteCar
};
