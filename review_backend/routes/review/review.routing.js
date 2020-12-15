const express = require('express');
const router = express.Router();


const review_response = require('../review/review_response.action');
const get_reviews = require('../review/get_review.action');
const get_response = require('./get_response.action');
const get_comments = require('./get_comments.action');
const post_comment = require('./post_comments.action');
const put_comment = require('./put_comment.action');
const publish_review = require('./publish_review.action');
const update_review = require('./update_review.action');

router.get('/review-data/:mappingId', get_reviews);
router.get('/response-data/:mappingId', get_response);
router.get('/comments-list/:mappingId', get_comments);
router.post('/add-comment', post_comment);
router.put('/update-comment', put_comment);
router.put('/publish-review', publish_review);
router.post('/review-response', review_response);
router.post('/update-review/:mappingId', update_review);
module.exports = router;