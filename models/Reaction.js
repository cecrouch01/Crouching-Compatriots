const { mongoose, Schema, model } = require('mongoose');
const { formatDate } = require('../utils/getters');

const reactionSchema = new Schema(
    {
        reactionID: mongoose.ObjectId,
        reactionBody: {
            type: String,
            required: true,
            maxlength: 280,
        },
        username: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now(),
            get: formatDate
        }       
    }
);

module.exports = reactionSchema;