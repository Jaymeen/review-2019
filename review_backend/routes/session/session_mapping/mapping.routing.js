const express = require("express");
const router = express.Router();
const getUser= require('./getUser.action');
const getTemplate = require('./getTemplate.action');
const postMappingArray = require ('./postMappingArray.action');

router.get('/users', getUser);
router.get('/templates',getTemplate);
router.post('/mapping/:session_id',postMappingArray);

module.exports= router;