// const { validationResult } = require('express-validator/check');
const { validationResult } = require('express-validator');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
var db = require("../connection/database.js")



exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) { 
    const error = new Error('Validation failed.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;

  bcrypt
    .hash(password, 12)
    .then(hashedPw => {
         //   return user.save();
      const user = {
        username: username,
        email: email,
        password: hashedPw,
      };
    var sql ="INSERT INTO admin(username, email, password) VALUES (?, ?, ?)"
    // var sql ="INSERT INTO admin SET ?"

    // [${user.username}, ${user.email}, ${user.password}]
    db.run(sql, [user.username, user.email, user.password],  (err, result) => {
        console.log(user)
        console.log(result)
        if (err){
            res.status(400).json({"error": err.message})
            console.log(err)
            // return;
        }

        res.json({
            "message": "success",
            // "data": user,
            // "id" : this.lastID
        })
    });
    })
    // .then(result => {
    //   res.status(201).json({ message: 'User created!', id: result._id });
    // })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.login = (req, res, next) => {
    const sql =  `select * from admin where email = (?)`
    console.log(req.body)
    db.all(sql, [req.body.email], (err, result) => {
        if(err){
            console.log(err)
            return res.json({message: "login-failed"})
        } else {
            // console.log(result[0])
            if (result.length === 0) {
                return res.send(401, `password or email are incorrect`)
            }
            // if (result.length === 0) return res.send(`Invalid, cant found data, please register`)

            else {
                // bcrypt.compare(req.body.password, result[0].password, (err, data ) => {
                //     if(data) {
                //         res.send(result[0])
                //     } 
                //     console.log(err)
                //     console.log(data)
                // })
                bcrypt.compare(req.body.password, result[0].password)
                .then(val => {
                    if (val === false) return res.send(`password are incorrect`)
                    const { password, ...data } = result[0]
                    const expiresIn = 60 * 60
                    const token = jwt.sign({ ...data, role: 'admin' }, 'somesupersecretsecret', { expiresIn, subject: data.email })
                    res.json({
                      token,
                      exp: expiresIn,
                      ...data
                    })
                })
                
               

            }
        }
    })
}


exports.signupAnnotator = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) { 
    const error = new Error('Validation failed.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const username = req.body.username;
  const password = req.body.password;

  bcrypt
    .hash(password, 12)
    .then(hashedPw => {
         //   return user.save();
      const user = {
        username: username,
        password: hashedPw,
      };
    var sql ="INSERT INTO annotator(username, password) VALUES (?, ?)"
    // var sql ="INSERT INTO admin SET ?"

    // [${user.username}, ${user.email}, ${user.password}]
    db.run(sql, [user.username, user.password],  (err, result) => {
        console.log(user)
        console.log(result)
        if (err){
            res.status(400).json({"error": err.message})
            console.log(err)
            // return;
        }

        res.json({
            "message": "success",
            // "data": user,
            // "id" : this.lastID
        })
    });
    })
    // .then(result => {
    //   res.status(201).json({ message: 'User created!', id: result._id });
    // })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};


// login for annotator
exports.loginAnnotator = (req, res, next) => {
  const sql =  `select * from annotator where username = (?)`
  console.log(req.body)
  db.all(sql, [req.body.username], (err, result) => {
      if(err){
          console.log(err)
          return res.json({message: "login-failed"})
      } else {
          // console.log(result[0])
          if (result.length === 0) {
              return res.send(401, `password or email are incorrect`)
          }
          // if (!result) return res.send(`Invalid, cant found data, please register`)

          else {
              // bcrypt.compare(req.body.password, result[0].password, (err, data ) => {
              //     if(data) {
              //         res.send(result[0])
              //     } 
              //     console.log(err)
              //     console.log(data)
              // })
              bcrypt.compare(req.body.password, result[0].password)
              .then(val => {
                  if (val === false) return res.send(`password are incorrect`)
                  const { password, ...data } = result[0]
                  const expiresIn = 60 * 60
                  const token = jwt.sign({ ...data, role: 'annotator' }, 'somesupersecretsecret', { expiresIn, subject: data.username })
                  res.json({
                    token,
                    exp: expiresIn,
                    ...data
                  })
                  // res.send(result[0])
              })
              
             

          }
      }
  })
}

exports.loginA = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;
//   User.findOne({ email: email })
//     .then(user => {
//       if (!user) {
//         const error = new Error('A user with this email could not be found.');
//         error.statusCode = 401;
//         throw error;
//       }
//       loadedUser = user;
//       return bcrypt.compare(password, user.password);
//     })
//     .then(isEqual => {
//       if (!isEqual) {
//         const error = new Error('Wrong password!');
//         error.statusCode = 401;
//         throw error;
//       }
//       const token = jwt.sign(
//         {
//           email: loadedUser.email,
//           userId: loadedUser._id.toString()
//         },
//         'somesupersecretsecret',
//         { expiresIn: '1h' }
//       );
//       res.status(200).json({ token: token, userId: loadedUser._id.toString() });
//     })
//     .catch(err => {
//       if (!err.statusCode) {
//         err.statusCode = 500;
//       }
//       next(err);
//     });
};
