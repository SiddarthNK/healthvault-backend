const express = require('express');
const { getAppointments, bookAppointment, updateAppointmentStatus, getAllAppointments } = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').get(protect, getAppointments).post(protect, bookAppointment);
router.route('/all').get(protect, getAllAppointments);
router.route('/:id').put(protect, updateAppointmentStatus);

module.exports = router;
