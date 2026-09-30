const express = require('express');
const router = express.Router();
const ApplicationController = require('../controllers/application.controller');
const { validateCreateApplication, validateUpdateStatus } = require('../middlewares/validateDTO');

router.post('/', validateCreateApplication, ApplicationController.create);
router.get('/', ApplicationController.getAll);
router.put('/:id/status', validateUpdateStatus, ApplicationController.updateStatus);

module.exports = router;