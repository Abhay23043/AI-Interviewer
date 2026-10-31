import jwt from 'jsonwebtoken';

function authUser(req, res, next) {
    const authorization = req.headers.authorization;
    const token = authorization?.startsWith("Bearer ")
        ? authorization.slice(7)
        : null;

    if (!token) {
        return res.status(401).json({
            message: "Token not Provided"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.userId = decoded.userId
        next()
    } catch (err) {
        res.status(401).json({
            message: `authUser error: ${err.message}`
        })
    }
}

export default { authUser };