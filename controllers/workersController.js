const WorkersModel = require('../models/workersModel');

class WorkersController {
    constructor(dbFilePath) {
        this.workersModel = new WorkersModel(dbFilePath);
    }

    addWorkers(name, uuid, online, last, rhr, chr, referral , callback) {
        try {
            console.log(name, uuid, online, last, rhr, chr, referral)
            this.workersModel.createWorkers(name, uuid, online, last, rhr, chr, referral, callback);    
        } catch (error) {   
        }
    }

    getAllWorkersByName(name, callback){
        try {
            console.log(name)
            this.workersModel.getWorkerByname(name, callback);    
        } catch (error) {   
        }
    }
}

module.exports = WorkersController;