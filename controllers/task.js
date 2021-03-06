var db = require("../connection/database.js")
const path = require('path')
const multer = require('multer')
const fs = require('fs')
const rootdir = path.join(__dirname , '/../..' )
const productdir = path.join (rootdir , 'konvergen.ai_test_backend/files/datasets')

const {Storage} = require('@google-cloud/storage');
const admin = require("firebase-admin");

const serviceAccount = require("../service_account.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "rakha96.appspot.com"
});

const bucket = admin.storage().bucket();

// const folder = multer.diskStorage(
//     {
//         destination: function(req,file,cb){
//             cb(null,productdir)
//         },
//         filename: function(req,file,cb){
//             cb(null, Date.now() + file.fieldname + path.extname(file.originalname))
//         }
//     }
// )

// const upstore = multer (
//     {
//         storage : folder,
//         limits : {
//             fileSize : 20000000000000 
//         },
//         fileFilter(req,file,cb){
//             let photo = file.originalname.match(/\.(zip)$/)

//             if(!photo){
//                 cb(new Error('Masukan file dengan extensi zip'))
//             }

//             cb(undefined, true)
//         }
//     }
// )

// const storage = new Storage({
//     projectId: "rakha96",
//     keyFilename: "../service_account.json"
// })

// const bucket = storage.bucket("gs://rakha96.appspot.com");

const uploadImageToStorage = (file) => {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject('No image file');
      }
    //   Date.now() + file.fieldname + path.extname(file.originalname)
      let newFileName = `${Date.now()}${file.fieldname}${path.extname(file.originalname)}`;

      let fileUpload = bucket.file(newFileName);
      const blobStream = fileUpload.createWriteStream({
        metadata: {
          contentType: file.mimetype
        }
      });
  
      blobStream.on('error', (error) => {
          console.error(error)
        reject('Something is wrong! Unable to upload at the moment.');
      });
  
      blobStream.on('finish', () => {
        // The public URL can be used to directly access the file via HTTP.

        fileUpload.getSignedUrl({
            action: 'read',
            expires: '03-09-2341'
        }).then(urls => resolve(urls[0]))
      });
  
      blobStream.end(file.buffer);
    });
}

// admin create new task
exports.create = (req, res, next)  => {
    const data = req.body
    console.log(req.body)
    var sql = "INSERT INTO tasks(name, description, dataset, booked, admin_id) VALUES (?, ?, ?, ?, ?)"
    const file = req.file

    if (file) {
        uploadImageToStorage(file)
            .then(fileUrl => {
                db.run(sql, [req.body.name, req.body.description, fileUrl, 0, parseInt(data.admin_id) ], (err, result) => {
                    if (err){
                        res.status(400).json({"error": err.message})
                    }
                    res.json({
                        "message": "success"
                    })
                })
            })
    }
    
}

exports.editTask = (req, res, next) => {
    console.log(req.file)
    const file = req.file
    const sql = `update tasks SET name = ?, description = ?, dataset =  ?, booked = ?, admin_id = ? where id = ?`
    const paramsId = req.params.id    
    if (file) {
        uploadImageToStorage(file)
            .then(fileUrl => {

                const tasks = {
                    name: req.body.name, 
                    description: req.body.description, 
                    dataset: fileUrl, 
                    // dataset: req.file.name, 
                    booked: req.body.booked, 
                    admin_id: req.body.admin_id

                }
                db.run(sql, tasks.name, tasks.description, tasks.dataset, tasks.booked, tasks.admin_id, paramsId, (err, result) => {
                    if(err){
                        console.log(err)
                        res.send(err)
                    }
                    res.send(result)
                })
            })
    }
    

}

// admin booked the task 
exports.bookingTask = (req, res, next) => {
    const sql = 'update tasks set booked = 1 where id = ?'
    const sql2 = 'insert into booking(admin_id, task_id) VALUES (?,?)'
    const paramsId = req.params.id
    db.all(sql,paramsId, (err, result) => {
        if(err){
            res.send(err)
        }

        if(result){
            // res.send(result)
            db.run(sql2, [req.body.admin_id, paramsId], (err2, result2) => {
                if(err2){
                    console.log(err2)
                    res.send(err2)
                }
                res.send(result2)
            })

        }
    })
}

// admin revoking task
// must be created again
exports.revokingTask = (req, res, next) => {
    const sql = 'update tasks set booked = 0 where id = ?'
    const sql2 = 'delete from booking where task_id = ? and admin_id = ?'
    const paramsId = req.params.id
    db.all(sql,paramsId, (err, result) => {
        if(err){
            console.log(err)
        }
        db.all(sql2, paramsId, req.body.admin_id, (err2, result2) => {
            if(err2){
                res.send(err2)
            }            
                res.send(result2)
        })
    })
}

exports.disableTask = (req, res, next) => {
    const sql = 'update tasks set disabled = 1 where id = ?'
    // const sql2 = 'delete from booking where task_id = ? and admin_id = ?'
    const paramsId = req.params.id
    db.all(sql,paramsId, (err, result) => {
        if(err){
            console.log(err)
        }
        // db.all(sql2, paramsId, req.body.admin_id, (err2, result2) => {
        //     if(err2){
        //         res.send(err2)
        //     }            
        //         res.send(result2)
        // })
        res.send(result)

    })
}

// get all
exports.getAll = (req, res, next) => {
    const sql = 'select * from tasks where disabled = 0'

    db.all(sql, (err, result) => {
        if(err){
            console.log(err)
        }
        console.log(result)
        res.send(result)
    })
}

// get by id 
exports.get = (req, res, next) => {
    const sql = 'select * from tasks where id = ?'
    paramsId = req.params.id
    db.all(sql, paramsId, (err, result) => {
        res.send(result)
    })
}

// get by admin
exports.getByAdmin = (req, res, next) => {
    const sql = 'select * from tasks where admin_id = ?'
    paramsId = req.params.admin_id
    console.log(paramsId)
    db.all(sql, paramsId, (err, result) => {
        if(err){
            console.log(err)
        }
        console.log(result)
        res.send(result)
    })
}


// download dataset
exports.downloadDataset = (req, res, next) => {
    const options = {
        root: productdir
    }

    const data = req.params.dataset

    // res.sendFile(data, options, function(err){
        res.download(path.join(productdir, data), function(err){


        if(err) return res.send(err)
        console.log(productdir)
        // console.log(res)
        // res.sendFile(options.root)
    })
}


// booking dataset by annotator
exports.bookingTaskByAnnotator = (req, res, next) => {
    const sql = 'update tasks set booked = 1 where id = ?'
    const sql2 = 'insert into booking(annotator_id, task_id) VALUES (?,?)'
    const paramsId = req.params.id
    db.all(sql,paramsId, (err, result) => {
        if(err){
            res.send(err)
        }

        if(result){
            // res.send(result)
            db.run(sql2, [req.body.annotator_id, paramsId], (err2, result2) => {
                if(err2){
                    console.log(err2)
                    res.send(err2)
                }
                res.send(result2)
            })

        }
    })
}

// annotator's task lists
exports.getAllByAnnotator = (req, res, next) => {
    const sql = 'select * from tasks inner join booking on booking.task_id = tasks.id where annotator_id = ?;'
    const paramsId = req.params.annotator_id
    db.all(sql, paramsId,  (err, result) => {
        if(err){
            console.log(err)
        }
        console.log(result)
        res.send(result)
    })
}
