const express = require('express');
const router = express.Router();

const { isLogging } = require('../middleware/checkAuth');
const dashboardController = require('../controller/dashboardController');
;
router.get('/dashboard', isLogging, dashboardController.dashboard);

router.get('/dashboard/item/:id', isLogging, dashboardController.dashboardSearch)
router.post('/dashboard/item/:id', isLogging, dashboardController.dashboardUpdate);
router.delete('/dashboard/item-delete/:id', isLogging, dashboardController.dashboardDelete);
router.get('/dashboard/add', isLogging, dashboardController.dashboardCreate);
router.post('/dashboard/add', isLogging, dashboardController.dashboardCraeting);
router.get('/dashboard/search', isLogging, dashboardController.dashboardSearch1);
router.post('/dashboard/search', isLogging, dashboardController.dashboardSearchSubmit);

module.exports = router;
