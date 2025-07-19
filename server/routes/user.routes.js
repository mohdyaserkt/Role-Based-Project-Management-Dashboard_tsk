import express from 'express';
import { protect, admin, manager } from '../middleware/auth.js';
import { getUsers, createUser, updateUserRole } from '../controllers/user.controller.js';

const router = express.Router();

router.route('/')
  .get(protect, manager, getUsers)
  .post(protect, admin, createUser);

router.route('/role/:id').put(protect, admin, updateUserRole);

export default router;