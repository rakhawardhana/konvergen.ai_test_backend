const express = require('express');


const annotatorController = require('../controllers/annotator');
const { checkAdmin } = require('../middleware/authorization')
const authenticationMiddleware = require('../middleware/authentication')

const router = express.Router();

const path = require('path')

router.get('/listAnnotator', authenticationMiddleware, checkAdmin, annotatorController.listAnnotator)
router.patch('/editAnnotator/:id', authenticationMiddleware, checkAdmin, annotatorController.editAnnotator)// edit annotator
router.delete('/deleteAnnotator/:id', authenticationMiddleware, checkAdmin, annotatorController.deleteAnnotator)// delete task

module.exports = router;
