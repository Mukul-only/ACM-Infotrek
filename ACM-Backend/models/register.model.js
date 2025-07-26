import mongoose from "mongoose";

const registerSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // For individual or group leader
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    registrationDate: { type: Date, default: Date.now },
    type: { type: String, enum: ['individual', 'group'], required: true },
    groupName: { type: String }, // Only for group registrations
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Only for group registrations
}, { timestamps: true });

const Register = mongoose.model('Register', registerSchema);
export default Register;