import genToken from "../config/token.js";
import userModel from "../model/user.model.js";
import googleUserModel from "../model/googleuser.model.js";
async function googleAuthController(req, res) {
    try {
        const { name, email } = req.body
        let user = await googleUserModel.findOne({ email });
        if (!user) {
            user = await googleUserModel.create({
                name: name,
                email: email
            })
        }
        const token = genToken(user._id, user.email)
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            message: "Google Login Successfully",
            user
        })
    } catch (error) {
        res.status(500).json({
            message: `Google Auth Error: ${error.message}`
        });
    }
}

export default googleAuthController;
