import express from 'express';
import { protect, manager } from '../middleware/auth.js';
import {
  createTask,
  getTasks,
  getEmployeeTasks,
  updateTaskStatus,
  deleteTask,
  updateTask,
} from '../controllers/task.controller.js';

const router = express.Router();

router.route('/').post(protect, manager, createTask).get(protect, getTasks);
router.route('/employee/:id').get(protect, getEmployeeTasks);
router.route('/status/:id').put(protect, updateTaskStatus);
router.route('/:id').put(protect, updateTask);
router.route('/:id').delete(protect, deleteTask);

export default router;