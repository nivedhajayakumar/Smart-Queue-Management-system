const Department = require("../models/Department");

async function createDepartment(req, res) {
    try {
        const department = await Department.create(req.body);

        res.status(201).json({
            message: "Department created successfully",
            department
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to create department",
            error: error.message
        });
    }
}

async function getAllDepartments(req, res) {
    try {
        const departments = await Department.find().sort({ name: 1 });

        res.json({
            count: departments.length,
            departments
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch departments",
            error: error.message
        });
    }
}

module.exports = {
    createDepartment,
    getAllDepartments
};