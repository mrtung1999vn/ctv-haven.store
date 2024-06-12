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
        this.userModel.getUserByUsername(username, password, (err, user) => {
            if(user=== null){ 
                callback(null, false);  // Authentication error  
                return    
            }
            if (err) {
                callback(err);
            } else if (user.username !== user || user.password !== password) {
                callback(null, false);  // Authentication error
            } else {
                callback(null, true);  // Authentication successful
            }
        });
    }

    getUserName(username, password, callback){
        this.userModel.getUserByUsername(username, password,callback)
    }

    updateUserByName(token, id, callback){
        this.userModel.updateUserByName(token, id, callback)
    }
}

module.exports = UserController;