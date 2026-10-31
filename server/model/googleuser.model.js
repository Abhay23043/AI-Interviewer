import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is Required"]
    },
    email: {
        type: String,
        unique:true,
        required: [true, "Email is Required"]
    },
    credits:{
        type:Number,
        default:100
    }
},{
    timestamps:true
})

const googleUserModel = mongoose.model("googleusers", userSchema)

export default googleUserModel;