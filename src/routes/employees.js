const express = require('express');
const Employee = require('../dto/employee');
const EmployeeRepository = require('../repository/employeeRepository');
const databasePool = require('../database/databasePool');
const jwtUtil = require('../security/jwt/jwt-util')

const router = express.Router();
const employeeRepository = new EmployeeRepository(databasePool);

// Get all employees
router.get('/', jwtUtil.authenticateToken, async (req, res) => {
    try {
        const employees = await employeeRepository.getAll();

        res.json(employees);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get an employee by ID
router.get('/:id', async (req, res) => {
    try {
        const employee = await employeeRepository.getById(req.params.id);
        if (employee instanceof Error) {
            res.status(404).json({ error: 'Employee not found' });
            return;
        }
        res.json(employee);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add a new employee
router.post('/', async (req, res) => {
    try {
        const { id, firstName, lastName, email } = req.body;
        const newEmployee = new Employee({ id, firstName, lastName, email });
        const result = await employeeRepository.add(newEmployee);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update an existing employee
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, email } = req.body;

        let employee = await employeeRepository.getById(id);

        if (employee instanceof Error) {
            res.status(404).json({ error: 'Employee not found' });
            return;
        }

        // Update employee details
        employee.firstName = firstName;
        employee.lastName = lastName;
        employee.email = email;

        const updatedEmployee = await employeeRepository.update(employee);

        res.json(updatedEmployee);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete an employee by ID
router.delete('/:id', async (req, res) => {
    try {
        const result = await employeeRepository.deleteById(req.params.id);
        res.status(204).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;