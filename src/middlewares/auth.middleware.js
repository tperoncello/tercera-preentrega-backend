import logger from "../logger.js"

export const privateRoutes = ( req, res, next ) =>{
    if ( req.user ) return res.redirect('/profile')
    next()
}

export const publicRoutes = ( req, res, next ) =>{
    if ( !req.user ) return res.redirect('/')
    next()
}

export const handlePolicies = policies => (req, res, next) => {
    console.log('Policies:', policies);
    if (policies.includes('PUBLIC')) return next()
    if (!req.user) return res.status(401).json({ status: 'error', error: 'You are not logged-in' })
    if (policies.length > 0) {
        console.log("role: ", req.user.user.role.toUpperCase())
        if(!policies.includes(req.user.user.role.toUpperCase())) {
            return res.status(403).json({ status: 'error', error: 'You are not authorized' })
        }
    }
    next();
};



