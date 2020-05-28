const express = require('express');
const { body } = require('express-validator');

const taskController = require('../controllers/task');
const { checkAdmin } = require('../middleware/authorization')
const authenticationMiddleware = require('../middleware/authentication')

const router = express.Router();

const path = require('path')
const multer = require('multer')
const fs = require('fs')
const rootdir = path.join(__dirname , '/../..' )
const productdir = path.join (rootdir , 'konvergen.ai_test_backend/files/datasets')


const folder = multer.diskStorage(
    {
        destination: function(req,file,cb){
            cb(null,productdir)
        },
        filename: function(req,file,cb){
            cb(null, Date.now() + file.fieldname + path.extname(file.originalname))
        }
    }
)

const upstore = multer (
    {
        storage : folder,
        limits : {
            fileSize : 20000000000000 //bytes
        },
        fileFilter(req,file,cb){
            let photo = file.originalname.match(/\.(zip)$/)

            if(!photo){
                cb(new Error('Masukan file dengan extensin zip'))
            }

            cb(undefined, true)
        }
    }
)




// manage dataset
router.post('/createTask', authenticationMiddleware, checkAdmin, upstore.single('datasets'), taskController.create); // create task and upload zip
router.patch('/editTask/:id', authenticationMiddleware, checkAdmin, upstore.single('datasets'), taskController.editTask ) //  edit task and dataset


// manage task
router.get('/alltask', authenticationMiddleware, taskController.getAll) // get all tasks
router.get('/:id', authenticationMiddleware, taskController.get) // get task by id
router.get('/task/:admin_id', authenticationMiddleware, checkAdmin, taskController.getByAdmin) // get task by admin
router.patch('/bookingTask/:id', authenticationMiddleware, checkAdmin, taskController.bookingTask)// booking task
router.patch('/revokingTask/:id', authenticationMiddleware, checkAdmin, taskController.revokingTask)// revoking task
router.get('/downloadDataset/:dataset', authenticationMiddleware, taskController.downloadDataset) // download dataset
router.patch('/bookingTaskAnnotator/:id', authenticationMiddleware, taskController.bookingTaskByAnnotator)// booking task
router.get('/alltask/:annotator_id', authenticationMiddleware, taskController.getAllByAnnotator) // tasks list by annotator
router.patch('/disableTask/:id', authenticationMiddleware, checkAdmin, taskController.disableTask) // disable task

module.exports = router;
