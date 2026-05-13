import jwt from 'jsonwebtoken'

const authMiddleware = (req, res, next) => {
    
    const authHeader = req.headers.authorization

    if(!authHeader){
        return res.status(401).json({
            message:"Authorization header missing"
        })
    }
    const token = authHeader.split(' ')[1]

    try {
        // jwt.verify returns the decoded payload
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        // attach it to req.user
        req.user = decoded    
        next()
    } catch(err) {
        return res.status(401).json({
            message:"Invalid token"
        })
    }
}

export default authMiddleware