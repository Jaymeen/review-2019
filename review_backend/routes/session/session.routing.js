const express = require('express');
const router = express.Router();
const get_session_by_id = require('./get_session_by_id.action');
const get_sessionlist = require('./get_sessionlist.action');
const get_sessions_name = require('./get_sessions_name.action');
const session_template_mapping_details = require('./session_template_mapping_details.action');
const get_mapping_list = require('./get_mapping_list.action');
const create_session = require('./create_session.action');
const update_session = require('./update_session.action');
const delete_session = require('./delete_session.action');
const session_mapping = require('./session_mapping/mapping.routing');;


router.get('/session-details/:session_id', get_session_by_id);
router.post('/session-list', get_sessionlist);
router.get('/session-name', get_sessions_name)
router.post('/session-mapping-details/:session_id', session_template_mapping_details);
router.post('/mapping-list', get_mapping_list);
router.delete('/session-delete', delete_session);
router.use('/session-mapping', session_mapping);
router.post('/create', create_session);
router.put('/updateById/:session_id', update_session);

module.exports = router;
