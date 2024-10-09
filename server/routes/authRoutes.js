const express = require('express');
const { signup, login, employee, getEmployeesByManager, getEmployeesByUserType} = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/employee', authMiddleware, employee);
router.get('/employees/manager/:managerId',authMiddleware, getEmployeesByManager);
router.get('/admin/users/:userType', authMiddleware, getEmployeesByUserType)
router.get('/admin',authMiddleware, (req, res)=>{
    res.send("Success")
})


module.exports = router;
