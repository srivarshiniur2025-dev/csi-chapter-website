import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    domain: { type: String, default: 'General' },
    stack: { type: [String], default: [] },
    github: { type: String, default: '' },
    demo: { type: String, default: '' },
    category: { type: String, default: 'Student' },
    featured: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

projectSchema.methods.toPublicJSON = function toPublicJSON() {
  return {
    id: this.slug,
    _id: this._id,
    title: this.title,
    description: this.description,
    domain: this.domain,
    stack: this.stack,
    github: this.github,
    demo: this.demo,
    category: this.category,
    featured: this.featured,
  };
};

export const Project = mongoose.model('Project', projectSchema);
