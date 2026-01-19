const Appointment = require('../models/Appointment');

// @desc    Get user appointments
// @route   GET /api/appointments
// @access  Private
const getAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ user: req.user._id }).sort({ date: 1 });
        res.json(appointments);
    } catch (error) {
        console.error('Appointments DB error:', error.message);
        res.status(503).json({ message: 'Database busy.' });
    }
};

// @desc    Book new appointment
// @route   POST /api/appointments
// @access  Private
const bookAppointment = async (req, res) => {
    const { doctorName, specialization, date, mode } = req.body;

    try {
        console.log('Booking Appointment Request:', req.body);
        console.log('User ID:', req.user._id);

        const appointment = new Appointment({
            user: req.user._id,
            doctorName,
            specialization,
            date,
            mode,
        });

        const createdAppointment = await appointment.save();
        res.status(201).json(createdAppointment);
    } catch (error) {
        console.error('Error booking appointment:', error);
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update appointment status
// @route   PUT /api/appointments/:id
// @access  Private
const updateAppointmentStatus = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);

        if (appointment && appointment.user.toString() === req.user._id.toString()) {
            appointment.status = req.body.status || appointment.status;
            if (req.body.date) appointment.date = req.body.date;

            const updatedAppointment = await appointment.save();
            res.json(updatedAppointment);
        } else {
            res.status(404).json({ message: 'Appointment not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all appointments (for doctors/admin)
// @route   GET /api/appointments/all
// @access  Private (Doctor/Admin only)
const getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({}).sort({ date: 1 });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAppointments, bookAppointment, updateAppointmentStatus, getAllAppointments };
