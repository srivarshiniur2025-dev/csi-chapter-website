import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: {
      type: String,
      enum: ['Events', 'Workshops', 'Hackathons', 'Team', 'Technical'],
      default: 'Events',
    },
    imageUrl: { type: String, required: true },
    caption: { type: String, default: '' },
    eventSlug: { type: String, default: '' },
    isPublished: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

gallerySchema.methods.toPublicJSON = function toPublicJSON() {
  return {
    id: this._id.toString(),
    title: this.title,
    category: this.category,
    imageUrl: this.imageUrl,
    caption: this.caption,
    eventSlug: this.eventSlug,
    createdAt: this.createdAt,
  };
};

export const GalleryItem = mongoose.model('GalleryItem', gallerySchema);
