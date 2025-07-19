import Project from '../models/Project.js';
import User from '../models/User.js';

export const createProject = async (req, res) => {
  const { title, description, team } = req.body;

  const project = await Project.create({
    title,
    description,
    manager: req.user._id,
    team,
  });

  if (project) {
    const populatedProject = await project.populate(
      'manager team',
      'name email role'
    );

    res.status(201).json(populatedProject);
  } else {
    res.status(400);
    throw new Error('Invalid project data');
  }
};

export const getProjects = async (req, res) => {
  let projects;
  if (req.user.role === 'admin') {
    projects = await Project.find({}).populate('manager team', 'name email role');
  } else if (req.user.role === 'manager') {
    projects = await Project.find({ manager: req.user._id }).populate(
      'manager team',
      'name email role'
    );
  }
  res.json(projects);
};

export const getEmployeeProjects = async (req, res) => {
  const projects = await Project.find({ team: req.params.id }).populate(
    'manager team',
    'name email role'
  );
  res.json(projects);
};

export const updateProject = async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (project) {
     
    if (
      req.user.role !== 'admin' &&
      project.manager.toString() !== req.user._id.toString()
    ) {
      res.status(403);
      throw new Error('Not authorized to update this project');
    }

    project.title = req.body.title || project.title;
    project.description = req.body.description || project.description;
    project.team = req.body.team || project.team;

    const updatedProject = await project.save();
    const populatedProject = await updatedProject.populate(
      'manager team',
      'name email role'
    );
    res.json(populatedProject);
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
};

export const deleteProject = async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (project) {
    
    if (
      req.user.role !== 'admin' &&
      project.manager.toString() !== req.user._id.toString()
    ) {
      res.status(403);
      throw new Error('Not authorized to delete this project');
    }

    await Project.deleteOne({ _id: req.params.id });
    res.json({ message: 'Project removed' });
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
};