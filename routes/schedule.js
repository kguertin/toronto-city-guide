const express = require('express');
const router = express.Router();

const scheduleController = require('../controllers/scheduleController');

router.post('api/schedules', scheduleController.postSchedule);
//router.get('api/schedules', scheduleController.getSchedules);

module.exports = router