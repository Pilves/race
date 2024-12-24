const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');


router.post('/cars', carController.addCar);
router.get('/cars', carController.getCars);
router.get('/cars/:id', carController.getCarById);
router.get('/cars/number/:carNumber', carController.getCarByNumber);
router.get('/cars/available/:sessionId', carController.getAvailableCars);
router.put('/cars/:id', carController.updateCar);
router.delete('/cars/:id', carController.deleteCar);

module.exports = router;
