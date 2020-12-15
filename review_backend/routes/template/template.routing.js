const express = require('express');
const router = express.Router();

const get_templatelist = require('./get_templatelist.action');
const get_template_by_id = require('./get_template_by_id.action');
const get_templates_name = require('./get_templates_name.action');
const template_insert_update = require('./template_insert_update.action');
const delete_template = require('./delete_template.action');

router.get("/template-details/:template_id", get_template_by_id);
router.post("/template-list", get_templatelist);
router.get("/template-name", get_templates_name);

router.post('/', template_insert_update);
router.delete("/", delete_template);

module.exports = router;
