var sqlite3 = require('sqlite3').verbose()
var md5 = require('md5')

const DBSOURCE = "konvergen.db" 


let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQLite database.')
        db.run(`create table IF NOT EXISTS admin (id integer primary key autoincrement, 
            username varchar(50) not null unique, email varchar(50) not null unique, 
            password varchar(366) not null)`,
            (err) => {
                if(err) {
                    console.log(err)
                }
           
            });  
        
        db.run(`create table IF NOT EXISTS tasks (id integer primary key autoincrement, name varchar(50) not null, 
                description TEXT not null, dataset varchar(255) not null, booked boolean not null default 0, 
                disabled boolean not null default 0, admin_id integer not null, foreign key (admin_id) REFERENCES admin(id))`,
            (err) => {
                        if(err) {
                            console.log(err)
                        }
    
        
            });  

        db.run(`create table IF NOT EXISTS annotator (id integer primary key autoincrement, username varchar(50) not null unique, password varchar(366) not null);`,
            (err) => {
                    if(err) {
                        console.log(err)
                    }

             });  

        db.run(`create table IF NOT EXISTS booking (admin_id integer, annotator_id integer, task_id integer not null, foreign key (admin_id) references admin(id), foreign key (annotator_id) REFERENCES annotator(id), foreign key (task_id) REFERENCES tasks(id));`,
             (err) => {
                     if(err) {
                         console.log(err)
                     }
 
             });  
        
    }
});


module.exports = db








// create table IF NOT EXISTS tasks (id integer primary key autoincrement, name varchar(50) not null, description TEXT not null, dataset varchar(255) not null, booked boolean not null default 0, disabled boolean not null default 0, admin_id integer not null, foreign key (admin_id) REFERENCES admin(id));

// create table IF NOT EXISTS booking (admin_id integer, annotator_id integer, task_id integer not null, foreign key (admin_id) references admin(id), foreign key (annotator_id) REFERENCES annotator(id), foreign key (task_id) REFERENCES tasks(id)); 


// baru 

// create table IF NOT EXISTS tasks (id integer primary key autoincrement, name varchar(50) not null, description TEXT not null, dataset varchar(255) not null, booked boolean not null default 0,  disabled boolean not null default 0, admin_id integer not null, foreign key (admin_id) REFERENCES admin(id));

// create table annotator (id integer primary key autoincrement, username varchar(50) not null unique, password varchar(366) not null);

// create table booking (admin_id integer, annotator_id integer, task_id integer not null, foreign key (admin_id) references admin(id), foreign key (annotator_id) REFERENCES annotator(id), foreign key (task_id) REFERENCES tasks(id));