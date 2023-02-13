import mongoose from "mongoose";

const Chat =  new mongoose.Schema({
    sender:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    receive:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
},{timestamps: true})

export default mongoose.model('Chat',Chat)