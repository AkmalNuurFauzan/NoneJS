const mongoose = require('mongoose');

const Scheme = mongoose.Schema;
const PostScheme = new Scheme({
    title: {
        type: String,
        require: true
    },
    body: {
        type: String,
        require: true
    },
    createAt: {
        type: Date,
        default: Date.now
    },
    updateAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Post', PostScheme);