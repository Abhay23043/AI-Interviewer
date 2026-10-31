import googleUserModel from "../model/googleuser.model.js"
import userModel from "../model/user.model.js"
import paymentModel from "../model/payment.model.js"


export const getCurrentUser = async (req,res) =>{
    const userId = req.userId
    const user = await googleUserModel.findById(userId) || await userModel.findById(userId)
    if(!user){
        return res.status(404).json({
            message:"User does not found."
        })
    }
    return res.status(200).json(user)
}

const creditPlans = {
    starter: { credits: 100, amount: 199 },
    professional: { credits: 300, amount: 499 },
    premium: { credits: 700, amount: 999 }
};

export const createDummyPaymentOrder = async (req, res) => {
    try {
        const plan = creditPlans[req.body.planId];
        if (!plan) {
            return res.status(400).json({ message: "Invalid credit plan." });
        }
        if (!req.userId) {
            return res.status(401).json({ message: "Authentication required." });
        }
        const orderId = `order_demo_${Date.now()}`;
        return res.status(200).json({
            orderId,
            key: "rzp_test_dummy",
            amount: plan.amount * 100,
            currency: "INR",
            credits: plan.credits,
            isDummy: true
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const verifyDummyPayment = async (req, res) => {
    try {
        const { orderId, paymentId, planId } = req.body;
        const plan = creditPlans[planId];
        if (!plan || !orderId || !paymentId) {
            return res.status(400).json({ message: "Invalid payment details." });
        }
        let user = await userModel.findById(req.userId);
        let onModel = "userModel";
        if (!user) {
            user = await googleUserModel.findById(req.userId);
            onModel = "googleUserModel";
        }
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const existingPayment = await paymentModel.findOne({ paymentId, userId: user._id });
        if (existingPayment) {
            return res.status(200).json({
                message: "Payment already verified.",
                credits: user.credits,
                payment: existingPayment
            });
        }

        user.credits += plan.credits;
        await user.save();
        const payment = await paymentModel.create({
            userId: user._id,
            onModel,
            orderId,
            paymentId,
            amount: plan.amount,
            credits: plan.credits,
            status: "Completed",
            provider: "Razorpay Dummy"
        });

        return res.status(200).json({
            message: "Credits added successfully.",
            credits: user.credits,
            payment
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};