const mongoose = require("mongoose");
const Schema = mongoose.Schema;
let messageSchema = new Schema(
    {
        roomID: {
            type: String,
            required: true,
        },
        message: [
            { name: String, message: String, id: String, senderMail: String },
        ],
    },
    {
        timestamps: true,
        collection: "messages",
    }
);
module.exports = mongoose.model("RoomMessage", messageSchema);
