const express = require('express');
const router = express.Router();
const raceController = require('../controllers/raceController');

/**
 * Routes for managing race modifications and sessions.
 */

/**
 * GET /race-mods
 * Retrieves the list of available race modifications (e.g., customizations, rules, settings).
 * Controller: getRaceMods
 */
router.get('/race-mods', raceController.getRaceMods);

/**
 * POST /sessions
 * Adds a new race session.
 * Controller: addRaceSessions
 * Expects session details in the request body.
 */
router.post('/sessions', raceController.addRaceSessions);

/**
 * GET /sessions
 * Retrieves a list of all race sessions.
 * Controller: getRaceSessions
 */
router.get('/sessions', raceController.getRaceSessions);

/**
 * PUT /sessions/:id
 * Updates an existing race session.
 * Controller: updateRaceSessions
 * Expects session details in the request body.
 * Path Parameter:
 * - id: The unique identifier of the session to be updated.
 */
router.put('/sessions/:id', raceController.updateRaceSessions);

/**
 * DELETE /sessions/:id
 * Deletes an existing race session.
 * Controller: deleteRaceSession
 * Path Parameter:
 * - id: The unique identifier of the session to be deleted.
 */
router.delete('/sessions/:id', raceController.deleteRaceSession);

/**
 * Routes for driver assignment within race sessions.
 */

/**
 * POST /sessions/:id/drivers
 * Assigns a driver to a specific race session.
 * Controller: assignDriverToSession
 * Path Parameter:
 * - id: The unique identifier of the session.
 * Expects driver ID in the request body.
 */
router.post('/sessions/:id/drivers', raceController.assignDriverToSession);

/**
 * GET /sessions/:id/drivers
 * Retrieves all drivers assigned to a specific race session.
 * Controller: getDriversForSession
 * Path Parameter:
 * - id: The unique identifier of the session.
 */
router.get('/sessions/:id/drivers', raceController.getDriversForSession);

/**
 * DELETE /sessions/:id/drivers/:assignmentId
 * Removes a driver from a specific race session.
 * Controller: removeDriverFromSession
 * Path Parameters:
 * - id: The unique identifier of the session.
 * - assignmentId: The unique identifier of the driver assignment to be removed.
 */
router.delete('/sessions/:id/drivers/:assignmentId', raceController.removeDriverFromSession);

router.get('/sessions/next', raceController.getNextRaceSession);

router.post('/sessions/:id/start', raceController.startRaceSession);
router.get('/sessions/live', raceController.getLiveRace);

module.exports = router;
