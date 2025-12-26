const express = require('express');
const router = express.Router();
const { getSummary, getDepartmentStats } = require('../controllers/statsController');

router.get('/summary', getSummary);
router.get('/department-stats', getDepartmentStats);

module.exports = router;
