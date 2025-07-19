import User from '../models/User.js';
import Project from '../models/Project.js';
import Task from '../models/Task.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await User.deleteMany();
    await Project.deleteMany();
    await Task.deleteMany();

    const admin = await User.create({
      name: 'Super admin',
      email: 'superadmin@gmail.com',
      password: '123456',
      role: 'admin',
    });

    const manager = await User.create({
      name: 'test manager',
      email: 'manager@gmail.com',
      password: '123456',
      role: 'manager',
    });

    const employee1 = await User.create({
      name: 'test employee 1',
      email: 'testemployee1@gmail.com',
      password: '123456',
      role: 'employee',
    });

    const employee2 = await User.create({
      name: 'test employee 2',
      email: 'testemployee2@gmail.com',
      password: '123456',
      role: 'employee',
    });

    console.log("data seeding Completed")

  } catch (error) {
    console.error('erron on  seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
