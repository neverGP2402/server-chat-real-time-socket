import mongoose from "mongoose";
import mongooseDelete from 'mongoose-delete';
const Users = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        max: 50,
    },
    username:{
        type: String,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        min: 6,
    },  
    gender:{
        type: String,
    },
    phone:{
        type: String,
    },
    birthday:{
        type: Date,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    googleId: {
        type: String,
        default: null,
    },
    facebookId: {
        type: String,
        default: null
    },
    avatar:{
        type: String,
        default: ''
    },
    address:{
        type: String,
    },
    socialLink:Array,
    setting: Array,
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
    },
    deletedAt: {
        type: Date,
    },
    roleId:{
        type: String,
        enum: ['AD1','AD2','AD3'],
    }
})

export default mongoose.model('Users', Users)