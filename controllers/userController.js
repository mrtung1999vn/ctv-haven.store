const UserModel = require('../models/userModel');

class UserController {
    constructor(dbFilePath) {
        this.userModel = new UserModel(dbFilePath);
    }

    registerUser(username, password, email,reference , callback) {
        try {
            console.log(username, password, email)
            this.userModel.createUser(username, password, email, reference, callback);    
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

    updateUserByName(token, id, callback){
        this.userModel.updateUserByName(token, id, callback)
    }
}

module.exports = UserController;