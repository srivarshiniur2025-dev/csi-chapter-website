import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    department: { type: String, default: '' },
    domainInterests: { type: [String], default: [] },
    bookmarkedEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
    savedResources: { type: [String], default: [] },
    achievements: { type: [String], default: ['Explorer Badge'] },
    firebaseUid: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

userSchema.methods.toSafeJSON = function toSafeJSON() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    department: this.department,
    domainInterests: this.domainInterests,
    bookmarkedEvents: this.bookmarkedEvents,
    savedResources: this.savedResources,
    achievements: this.achievements,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

export const User = mongoose.model('User', userSchema);
