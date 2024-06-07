const sqlite3 = require('sqlite3').verbose();

class ChatModel {
    constructor(dbFilePath) {
        this.db = new sqlite3.Database(dbFilePath);
        this.init();
    }

    init() {
        this.db.serialize(() => {
            this.db.run(`CREATE TABLE IF NOT EXISTS chats (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                singleMessage TEXT NOT NULL UNIQUE,
                username TEXT NOT NULL UNIQUE,
                dateNow TEXT NOT NULL
            )`);
        });
    }

    createUser(username, password, email, reference, callback) {
        try{
            
            this.db.run('INSERT INTO users (username, password, email, wallet, token, status, reference) VALUES (?, ?, ?, 0, 0, 0, ?)', [username, password, email, reference], callback);
        }catch (error){
            console.log(error)
        }
        
    }

    getUserByUsername(username, password, callback) {
        try{
            this.db.get('SELECT * FROM users WHERE username = ? and password = ?', [username, password], (err, row) => {
                if (err) {
                    console.error(`Error executing SQL query: ${err.message}`);
                    callback(err, null);
                    return
                } else {
                    console.log(row)
                    if (row) {
                        console.log('USERNAME TRUE')
                        callback(true, row);
                    } else {
                        console.log('USERNAME FALSE')
                        callback(false, null);
                    }
                }
            });
        }catch(error){

        }
    }


    updateUserByName(token, username, callback){
        
        this.db.get('UPDATE users SET token = ?, status = true WHERE username = ?', [token, username], (err, row) => {
            if (err) {
                callback(err, null);
            } else {
                    console.log('da cap nhap')
                    callback(true, row);
            }
        });


    }


}

module.exports = UserModel;