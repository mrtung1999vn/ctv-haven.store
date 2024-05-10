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
                password TEXT NOT NULL
            )`);
        });
    }

    createUser(username, password, callback) {
        this.db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], callback);
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


}

module.exports = UserModel;