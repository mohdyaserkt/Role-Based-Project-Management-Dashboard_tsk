import express from 'express';
import { protect, admin, manager } from '../middleware/auth.js';
import {
  createProject,
  getProjects,
  getEmployeeProjects,
  updateProject,
  deleteProject,
} from '../controllers/project.controller.js';

const router = express.Router();

router
  .route('/')
  .post(protect, manager, createProject)
  .get(protect, getProjects);
router.route('/employee/:id').get(protect, getEmployeeProjects);
router
  .route('/:id')
  .put(protect, updateProject)
  .delete(protect, deleteProject);

export default router;