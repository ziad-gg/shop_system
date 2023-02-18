const mongoose = require('mongoose');

const UsersSchema = new mongoose.Schema({
    userId: { type: String, require: true },
    channelId: { type: String, require: true },
    createdAt: { type: Number  },
    endsAt: Number,
    createBy: String,
    messageId: String,
    locked: { type: Boolean, default: false },
    since: Number,
});

const UsersModel = mongoose.model("Users", UsersSchema);

module.exports = UsersModel;