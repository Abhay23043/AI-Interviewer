import jwt from 'jsonwebtoken'

const genToken = (userId, email) => {
    const token = jwt.sign(
        { userId, email },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "7d" }
    )
    return token;
}

export default genToken;