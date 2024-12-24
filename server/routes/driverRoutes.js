const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driverController');

router.post('/drivers', driverController.addDriver);
router.get('/drivers', driverController.getDrivers);
router.put('/drivers/:id', driverController.updateDriver);
router.delete('/drivers/:id', driverController.deleteDriver);
router.get('/drivers/available/:sessionId', driverController.getAvailableDrivers);

module.exports = router;
