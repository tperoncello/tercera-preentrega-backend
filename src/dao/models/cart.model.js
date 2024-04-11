import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    products:[{
        _id: false,
        product:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "products"
        },
        quantity:{
            type: Number,
            default: 1
        }
    }]
})
mongoose.set("strictQuery", false)
const cartModel = mongoose.model("carts", cartSchema);

export default cartModel