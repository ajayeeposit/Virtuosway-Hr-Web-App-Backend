const express = require('express');
const {
  getEmployee,
  addEmployee,
  updateEmployee,
  getEmployeeById,
  deleteEmployee,
} = require('../controller/Employee');

const router = express.Router();

router.route('/').get(getEmployee).post(addEmployee);

router
  .route('/:id')
  .patch(updateEmployee)
  .get(getEmployeeById)
  .delete(deleteEmployee);

module.exports = router;
