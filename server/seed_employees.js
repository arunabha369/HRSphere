import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Employee from './models/Employee.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars from the root .env file
dotenv.config({ path: path.join(__dirname, '../.env') });

const employees = [
  {
    employeeId: 'EMP001',
    name: 'Arunabha Banerjee',
    role: 'Senior Software Engineer',
    department: 'Engineering',
    email: 'arunabha.banerjee@hrsphere.com',
    phone: '+91 98765 43210',
    status: 'Active',
    joinDate: new Date('2023-01-15'),
    salary: 120000,
    address: 'Kolkata, West Bengal'
  },
  {
    employeeId: 'EMP002',
    name: 'Akarsh Jha',
    role: 'Product Manager',
    department: 'Product',
    email: 'akarsh.jha@hrsphere.com',
    phone: '+91 98765 43211',
    status: 'Active',
    joinDate: new Date('2023-02-20'),
    salary: 110000,
    address: 'Mumbai, Maharashtra'
  },
  {
    employeeId: 'EMP003',
    name: 'Kishlay Kumar',
    role: 'UX Designer',
    department: 'Design',
    email: 'kishlay.kumar@hrsphere.com',
    phone: '+91 98765 43212',
    status: 'Active',
    joinDate: new Date('2023-03-10'),
    salary: 95000,
    address: 'Bangalore, Karnataka'
  },
  {
    employeeId: 'EMP004',
    name: 'Amit Verma',
    role: 'DevOps Engineer',
    department: 'Engineering',
    email: 'amit.verma@hrsphere.com',
    phone: '+91 98765 43213',
    status: 'Active',
    joinDate: new Date('2023-04-05'),
    salary: 105000,
    address: 'Delhi, NCR'
  },
  {
    employeeId: 'EMP005',
    name: 'Sunita Chatterjee',
    role: 'HR Manager',
    department: 'Human Resources',
    email: 'sunita.chatterjee@hrsphere.com',
    phone: '+91 98765 43214',
    status: 'Active',
    joinDate: new Date('2023-05-01'),
    salary: 90000,
    address: 'Kolkata, West Bengal'
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing employees to avoid duplicates if running multiple times (optional, but good for testing)
    // await Employee.deleteMany({});
    // console.log('Cleared existing employees');

    // Check for existing employees to avoid duplicate key errors
    for (const emp of employees) {
      const existing = await Employee.findOne({ $or: [{ employeeId: emp.employeeId }, { email: emp.email }] });
      if (!existing) {
        await Employee.create(emp);
        console.log(`Added employee: ${emp.name}`);
      } else {
        console.log(`Skipped existing employee: ${emp.name}`);
      }
    }

    console.log('Database seeding completed');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
