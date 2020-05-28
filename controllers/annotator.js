const { validationResult } = require('express-validator');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
var db = require("../connection/database.js")


exports.listAnnotator = (req, res, next ) => {
    const sql = 'select * from annotator'
    db.all(sql, (err, result) => {
        if(err) {
            res.send(err)
        }
        res.send(result)
    })

}

exports.editAnnotator = (req, res, next) => {

    const username = req.body.username;
    const password = req.body.password;
    console.log(req.params.id, req.body.password)
    bcrypt.hash(password, 12).
            then(hashedPw => {
                const user = {
                    // username: username,
                    password: hashedPw,
                  };

                //   const sql = 'update annotator set username = ?, password = ? where id = ?'
                  const sql = 'update annotator set password = ? where id = ?'

                  const paramsId = req.params.id
                  
                  db.run(sql, user.password, paramsId, (err, result) => {
                      if(err){
                          console.log(err)
                          res.send(err)
                      }
                      res.send(result)
                  })
                //   .catch(err => {
                //     if (!err.statusCode) {
                //       err.statusCode = 500;
                //     }
                //     next(err);
                //   });

            }).catch(err => {
                if (!err.statusCode) {
                  err.statusCode = 500;
                }
                next(err);
              });
   
}


exports.deleteAnnotator = (req, res, next) => {
    const sql = 'delete from annotator where id = ?'
    paramsId = req.params.id
    db.all(sql, paramsId, (err, result) => {
        if(err) {
            res.send(err)
        }
        res.send(result)
    })
}