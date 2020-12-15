const express = require('express');
const router = express.Router();
const get_reviewees = require('../user/dashboard/get_reviewees.action');
const get_reviewers = require('../user/dashboard/get_reviewers.action');

router.post('/dashboard', get_reviewees);
router.post('/my-reviews', get_reviewers);

module.exports = router;
