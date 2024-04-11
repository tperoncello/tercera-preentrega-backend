import messageModel from "../dao/models/message.model.js";

export const getMessagesController = async(req, res) => {
    const cart = req.user.user.cart
    const chat = await messageModel.find()
    res.render('chat', {cart: cart})
}