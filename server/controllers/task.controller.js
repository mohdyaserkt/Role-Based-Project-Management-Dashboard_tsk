import Task from '../models/Task.js';
import Project from '../models/Project.js';

export const createTask = async (req, res) => {
  const { title, description, projectId, assignedTo } = req.body;

  const project = await Project.findById(projectId);
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  if (
    req.user.role !== 'admin' &&
    project.manager.toString() !== req.user._id.toString()
  ) {
    res.status(403);
    throw new Error('Not authorized to create tasks for this project');
  }

  const task = await Task.create({
    title,
    description,
    project: projectId,
    assignedTo,
  });
if (!project.team.includes(assignedTo)) {
  project.team.push(assignedTo);
  await project.save();
}
  res.status(201).json(task);
};

export const getTasks = async (req, res) => {
  let tasks;
  if (req.user.role === 'admin') {
    tasks = await Task.find({}).populate('project assignedTo', 'title name');
  } else if (req.user.role === 'manager') {
    const projects = await Project.find({ manager: req.user._id });
    const projectIds = projects.map((p) => p._id);
    tasks = await Task.find({ project: { $in: projectIds } }).populate(
      'project assignedTo',
      'title name'
    );
  }
  res.json(tasks);
};

export const getEmployeeTasks = async (req, res) => {
  const tasks = await Task.find({ assignedTo: req.params.id }).populate(
    'project',
    'title description'
  );
  res.json(tasks);
};

export const updateTaskStatus = async (req, res) => {
  const { status } = req.body;
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  if (task.assignedTo.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this task');
  }

  task.status = status;
  const updatedTask = await task.save();
  res.json(updatedTask);
};

export const deleteTask = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  const project = await Project.findById(task.project);
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  if (
    req.user.role !== 'admin' &&
    project.manager.toString() !== req.user._id.toString()
  ) {
    res.status(403);
    throw new Error('Not authorized to delete this task');
  }

  await Task.deleteOne({ _id: req.params.id });
  res.json({ message: 'Task removed' });
};

export const updateTask = async (req, res) => {
  const { title, description, assignedTo } = req.body;
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  const project = await Project.findById(task.project);
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  if (
    req.user.role !== 'admin' &&
    project.manager.toString() !== req.user._id.toString()
  ) {
    res.status(403);
    throw new Error('Not authorized to update this task');
  }

  if (title) task.title = title;
  if (description) task.description = description;
  if (assignedTo) {
  task.assignedTo = assignedTo;

  const project = await Project.findById(task.project);
  if (project && !project.team.includes(assignedTo)) {
    project.team.push(assignedTo);
    await project.save();
  }
}

  const updatedTask = await task.save();
  const PopulatedupdatedTask = await Task.findById(task._id)
    .populate('project', 'title description')
    .populate('assignedTo', 'name email role');

  res.json(PopulatedupdatedTask);
};