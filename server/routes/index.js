const express = require('express')
const router = express.Router();
const mainController = require('../controller/mainController');
const { Route } = require('react-router-dom');


router.get('/', mainController.homepage)
router.get('/about', mainController.aboutpage)
router.get('/Features', mainController.Features)



module.exports = router
