const { mongoose } = require("mongoose");

const helper = {
    getMongoId(id) {
        return new mongoose.Types.ObjectId(id);
    },
}


module.exports = {
    helper
}