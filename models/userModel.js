const sqlite3 = require('sqlite3').verbose();

class UserModel {
    constructor(dbFilePath) {
        this.db = new sqlite3.Database(dbFilePath);
        this.init();
    }

    init() {
        this.db.serialize(() => {
            this.db.run(`CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL UNIQUE,
                email TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL,
                wallet TEXT NOT NULL,
                token TEXT NOT NULL,
                status TEXT NOT NULL
            )`);
        });
    }

    createUser(username, password, email, callback) {
        console.log( username, password, email )
        this.db.run('INSERT INTO users (username, password, email, wallet, token, status) VALUES (?, ?, ?, 0, 0, 0)', [username, password, email], callback);
    }

    getUserByUsername(username, callback) {
        this.db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
            if (err) {
                console.error(`Error executing SQL query: ${err.message}`);
                callback(err, null);
            } else {
                console.log(row)
                if (row) {
                    console.log('da co')
                    callback(true, row);
                } else {
                    console.log('chua co')
                    callback(false, null);
                }
            }
        });
    }


    updateUserByName(token, username, callback){
        
        this.db.get('UPDATE users SET token = ?, status = true WHERE username = ?', [token, username], (err, row) => {
            if (err) {
                console.error(`Error executing SQL query: ${err.message}`);
                callback(err, null);
            } else {
                    console.log('da cap nhap')
                    callback(true, row);
            }
        });


    }


}

module.exports = UserModel;