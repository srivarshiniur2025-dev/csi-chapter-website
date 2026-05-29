import { Project } from '../models/Project.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const listProjects = asyncHandler(async (req, res) => {
  const filter = req.user?.role === 'admin' ? {} : { isPublished: true };
  const projects = await Project.find(filter).sort({ featured: -1, createdAt: -1 });
  res.json({ projects: projects.map((p) => p.toPublicJSON()) });
});

export const createProject = asyncHandler(async (req, res) => {
  const slug =
    req.body.slug ||
    req.body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  const project = await Project.create({ ...req.body, slug, createdBy: req.user._id });
  res.status(201).json({ project: project.toPublicJSON() });
});

export const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findOneAndUpdate({ slug: req.params.slug }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!project) return res.status(404).json({ message: 'Project not found' });
  res.json({ project: project.toPublicJSON() });
});

export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findOneAndDelete({ slug: req.params.slug });
  if (!project) return res.status(404).json({ message: 'Project not found' });
  res.json({ message: 'Project deleted' });
});
