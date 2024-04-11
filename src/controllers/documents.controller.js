export const uploadFileController = async ( req, res ) => {
    const userId = req.user.user._id;
    const cart = req.user.user.cart
    res.render('uploadFile', { userId, cart: cart });
}