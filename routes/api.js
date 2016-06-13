var express = require('express');
var router = express.Router();
var populateCounts = require('../models/utilities/populate-counts');

router.get('/populateCounts', populateCounts);

module.exports = router;
