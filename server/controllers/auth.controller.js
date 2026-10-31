import userModel from "../model/user.model.js";
import bcrypt from 'bcrypt';
import genToken from "../config/token.js";

async function handleRegisterNewUserController(req, res) {
    const { name, email, password } = req.body

    const userAlreadyExist = await userModel.findOne({ email })

    if (userAlreadyExist) {
        return res.status(400).json({
            message: "User Already Exist, Please try login."
        })
    }

    const hashPassword = await bcrypt.hash(password, 10)

    const user = await userModel.create({
        name,
        email,
        password: hashPassword
    })

    //creating token

    // const token = jwt.sign(
    //     { id: user._id, email: user.email },
    //     process.env.JWT_SECRET_KEY,
    //     { expiresIn: "7d" }
    // )

    //set token into cookie
    const token = genToken(user._id, user.email)
    res.status(201).json({
        message: "User registerd successfully",
        user,
        token
    })

}
async function handleLoginUserController(req, res) {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email })
    if (!user) {
        return res.status(404).json({
            message: "User not Exists, Please register yourself"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
        return res.status(404).json({
            message: "Invalid email or password"
        })
    }

    // const token = jwt.sign(
    //     { id: user._id, email: user.email },
    //     process.env.JWT_SECRET_KEY,
    //     { expiresIn: "7d" }
    // )

    const token = genToken(user._id, user.email)
    res.status(201).json({
        message: "User login Successfully",
        user,
        token
    })

}

async function handleLogoutUserController(req, res) {
    try {
        res.status(200).json({
            message: "Logout successfully"
        })
    } catch (error) {
        res.status(500).json({
            message: `logout error: ${error}`
        })
    }
}

export default {
    handleRegisterNewUserController,
    handleLoginUserController,
    handleLogoutUserController
}