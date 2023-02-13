import mongoose from "mongoose";

const RequestAddFriend = new mongoose.Schema({
    sender:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    received:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    isFriend:{
        type: Boolean,
        default: false,
    }
},{timestamps:true})

export default mongoose.model('RequestAddFriend', RequestAddFriend)