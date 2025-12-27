const dotenv = require('dotenv');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

dotenv.config();

console.log('--- Config Test ---');
console.log('PORT:', process.env.PORT);
console.log('MONGO_URI exists:', !!process.env.MONGO_URI);
console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);

if (!process.env.MONGO_URI) {
    console.error('ERROR: MONGO_URI is missing!');
}

if (!process.env.JWT_SECRET) {
    console.warn('WARNING: JWT_SECRET is missing!');
}

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('SUCCESS: MongoDB Connected');
        process.exit(0);
    })
    .catch(err => {
        console.error('ERROR: MongoDB Connection Failed:', err.message);
        process.exit(1);
    });
