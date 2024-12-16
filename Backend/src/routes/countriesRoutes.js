const express = require('express');
const router = express.Router();
const countriesController = require('../controllers/countriesController');

router.get('/available', countriesController.getAvailableCountries);

router.get('/info/:countryCode', countriesController.getCountryInfo);

module.exports = router;