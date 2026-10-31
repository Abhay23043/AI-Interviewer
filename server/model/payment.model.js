import mongoose from 'mongoose'

const paymentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'onModel'
    },
    onModel: {
        type: String,
        required: true,
        enum: ['userModel', 'googleUserModel']
    },
    orderId: { type: String, required: true },
    paymentId: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    credits: { type: Number, required: true },
    status: { type: String, default: 'Completed' },
    provider: { type: String, default: 'Razorpay' },
    signature: { type: String, required: false }
}, { timestamps: true })

export default mongoose.model('Payment', paymentSchema)
