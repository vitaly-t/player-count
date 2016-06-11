var express = require('express');
var router = express.Router();
var updateCounts = require('../models/utilities/update-counts');

router.get('/updateCounts', updateCounts);

module.exports = router;
