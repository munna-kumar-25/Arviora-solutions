const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { getAnalyticsReport } = require('../controllers/analyticsController');

const router = express.Router();

router.get('/', authMiddleware, getAnalyticsReport);

module.exports = router;
