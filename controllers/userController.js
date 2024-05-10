const UserModel = require('../models/userModel');

class UserController {
    constructor(dbFilePath) {
        this.userModel = new UserModel(dbFilePath);
    }

    registerUser(username, password, callback) {
        try {
            this.userModel.createUser(username, password, callback);    
        } catch (error) {   
        }
    }

    loginUser(username, password, callback) {
        this.userModel.getUserByUsername(username, (err, user) => {
            if (err) {
                callback(err);
            } else if (!user || user.password !== password) {
                callback(null, false);  // Authentication error
            } else {
                callback(null, true);  // Authentication successful
            }
        });
    }

    getUserName(username, callback){
        this.userModel.getUserByUsername(username,callback)
    }
}

module.exports = UserController;