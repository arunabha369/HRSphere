import express from 'express';
import Employee from '../models/Employee.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get all employees
// @route   GET /api/employees
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const employees = await Employee.find({});
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get employee by ID
// @route   GET /api/employees/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (employee) {
      res.json(employee);
    } else {
      res.status(404).json({ message: 'Employee not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a new employee
// @route   POST /api/employees
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  const { employeeId, name, role, department, email, phone, joinDate, salary, address } = req.body;

  try {
    const employeeExists = await Employee.findOne({ email });
    if (employeeExists) {
      return res.status(400).json({ message: 'Employee already exists' });
    }

    const employee = await Employee.create({
      employeeId,
      name,
      role,
      department,
      email,
      phone,
      joinDate,
      salary,
      address,
    });

    res.status(201).json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update employee
// @route   PUT /api/employees/:id
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (employee) {
      employee.name = req.body.name || employee.name;
      employee.role = req.body.role || employee.role;
      employee.department = req.body.department || employee.department;
      employee.email = req.body.email || employee.email;
      employee.phone = req.body.phone || employee.phone;
      employee.status = req.body.status || employee.status;
      employee.salary = req.body.salary || employee.salary;
      employee.address = req.body.address || employee.address;

      const updatedEmployee = await employee.save();
      res.json(updatedEmployee);
    } else {
      res.status(404).json({ message: 'Employee not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete employee
// @route   DELETE /api/employees/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (employee) {
      await employee.deleteOne();
      res.json({ message: 'Employee removed' });
    } else {
      res.status(404).json({ message: 'Employee not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
