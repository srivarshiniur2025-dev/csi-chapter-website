import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    registration: { type: mongoose.Schema.Types.ObjectId, ref: 'Registration' },
    registrationId: { type: String, required: true },
    eventTitle: { type: String, required: true },
    memberName: { type: String, required: true },
    issuedAt: { type: Date, default: Date.now },
    verifyCode: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

certificateSchema.index({ user: 1, event: 1 }, { unique: true });

export const Certificate = mongoose.model('Certificate', certificateSchema);
