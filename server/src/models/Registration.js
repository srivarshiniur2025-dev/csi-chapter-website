import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    registrationId: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'cancelled'],
      default: 'approved',
    },
    form: {
      name: String,
      email: String,
      domain: String,
      yearDept: String,
      message: String,
    },
    qrPayload: { type: String, default: '' },
  },
  { timestamps: true }
);

registrationSchema.index({ user: 1, event: 1 }, { unique: true });

export const Registration = mongoose.model('Registration', registrationSchema);
