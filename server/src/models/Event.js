import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    title: { type: String, required: true },
    dateLabel: { type: String, required: true },
    venue: { type: String, required: true },
    label: { type: String, required: true },
    image: { type: String, required: true },
    imageAlt: { type: String, default: '' },
    shortDescription: { type: String, required: true },
    fullDescription: { type: String, required: true },
    startISO: { type: Date, required: true },
    totalSeats: { type: Number, required: true, min: 1 },
    seatsTaken: { type: Number, default: 0 },
    speaker: {
      name: { type: String, default: 'CSI Mentor' },
      role: { type: String, default: 'CSI VIT Chennai' },
    },
    techIcons: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

eventSchema.virtual('spotsLeft').get(function spotsLeft() {
  return Math.max(0, this.totalSeats - this.seatsTaken);
});

eventSchema.methods.toPublicJSON = function toPublicJSON() {
  return {
    id: this.slug,
    _id: this._id,
    title: this.title,
    date: this.dateLabel,
    venue: this.venue,
    label: this.label,
    image: this.image,
    imageAlt: this.imageAlt,
    shortDescription: this.shortDescription,
    fullDescription: this.fullDescription,
    startISO: this.startISO,
    totalSeats: this.totalSeats,
    seatsTaken: this.seatsTaken,
    spotsLeft: this.spotsLeft,
    speaker: this.speaker,
    techIcons: this.techIcons,
    featured: this.featured,
    isPublished: this.isPublished,
  };
};

export const Event = mongoose.model('Event', eventSchema);
