import mongoose from "mongoose";

const messagesCollections = 'messages';

const messageSchema = new mongoose.Schema({
    user: { type: String, required: true },
    message: { type: String, required: true }
})
mongoose.set("strictQuery", false)
const messageModel = mongoose.model(messagesCollections, messageSchema)

export default messageModel