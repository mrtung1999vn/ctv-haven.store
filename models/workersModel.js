const sqlite3 = require('sqlite3').verbose();

class workersModel {
    constructor(dbFilePath) {
        this.db = new sqlite3.Database(dbFilePath);
        this.init();
    }

    init() {
        this.db.serialize(() => {
            this.db.run(`CREATE TABLE IF NOT EXISTS workers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                uuid TEXT NOT NULL,
                online TEXT NOT NULL,
                last TEXT NOT NULL,
                rhr TEXT NOT NULL,
                chr TEXT NOT NULL,
                referral TEXT,
                dateNow TEXT NOT NULL
            )`);
        });
    }

    createWorkers(name, uuid, online, last, rhr, chr, referral, callback) {
        try{
            
            this.db.run("INSERT INTO workers (name, uuid, online, last, rhr, chr, referral, dateNow) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now') )", [name, uuid, online, last, rhr, chr, referral], callback);
        }catch (error){
            console.log(error)
        }
        
    }

    getWorkerByname(name, password, callback) {
        this.db.get('SELECT * FROM workers WHERE name = ?', [name, password], (err, row) => {
            if (err) {
                console.error(`Error executing SQL query: ${err.message}`);
                callback(err, null);
            } else {
                // console.log(row)
                if (row) {
                    console.log('WORKER TRUE')
                    callback(true, row);
                } else {
                    console.log('WORKER FALSE')
                    callback(false, null);
                }
            }
        });
    }


    // updateWorkerByName(token, Workername, callback){
        
    //     this.db.get('UPDATE users SET token = ?, status = true WHERE username = ?', [token, username], (err, row) => {
    //         if (err) {
    //             callback(err, null);
    //         } else {
    //                 console.log('da cap nhap')
    //                 callback(true, row);
    //         }
    //     });


    // }


}

module.exports = workersModel;