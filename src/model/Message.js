import mongoose from "mongoose";

const Message = new mongoose.Schema({
    message:{
        type: String,
        required: true,
    },
    users: Array,
    sender:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    received:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
    deletedAt: {
        type: Date,
    }
},{timestamps:true})

export default mongoose.model('Message', Message)