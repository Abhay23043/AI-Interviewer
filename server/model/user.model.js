import mongoose from 'mongoose'

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is Required"]
    },
    email: {
        type: String,
        unique:true,
        required: [true, "Email is Required"]
    },
    password: {
        type: String,
        required: [false, "Password is not Required"],
        sparse: true
    },
    credits:{
        type:Number,
        default:100
    }
},{
    timestamps:true
})

const userModel = mongoose.model("users", userSchema)

export default userModel;