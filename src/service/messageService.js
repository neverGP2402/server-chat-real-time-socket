import Message from "../model/Message"
import Users from "../model/Users";
import Chat from "../model/Chat";

const select = '_id name email avatar username isAdmin googleId facebookId deleteAt gender birthday settings'


const findUsers = async (array) => {
    if(array){
        const users = await Users.find({
            '_id':{
                $in: array
            }
        }).select(select)
        if(users.length > 0){
            return users
        }
        return []
    }
    return []
}

const sendMessageService = async(data) => {
    const {from, to, content} = data
    if(!from || !to || !content) {
        return {success: false, message:'Missing parameters'}
    }
    try {
        const checkIsChat = await Chat.findOne({
            $or: [{sender: from, receive: to},{receive: from, sender: to}]
        })
        if(!checkIsChat) {
            await Chat.create({
                sender: from,
                receive: to,
            })
        }
        const message = await Message.create({
            message: content,
            users: [from, to],
            sender: from,
            received:to,
        })
        if(message){
            return {success: true, message:'Sending message successfully'}
        }else{
            return {success: false, message: 'Cannot send message successfully'}
        }
        
        
    } catch (error) {
        return {success: false, message: 'Error sending message'}
    }
}

const getMessageService = async(data) => {
    const {from, to} = data
    if(!from || !to) {
        return {success: false, message:'Missing parameters'}
    }
    try {
        const messages = await Message.find({
            users:{
                $all:[from, to],
            }
        }).sort({updateAt: 1})

        if(messages.length>0){
            // console.log(messages)
            return {success: true, message:'Message was successfully sent', data: messages}
        }else{
            return {success: false, message:'Not find message', messages:[]}
        }
        
    } catch (error) {
        return {success: false, message:'Error get message', error: error}
    }
}

const getAllUsersIsmessage = async (id) => {
    if(!id) {return {success: false, message:'Missing required parameter ID'}}
    const userChatMessage = []
    try{
        const checkIsChatMessage = await Chat.find({
            $or: [{sender: id}, {receive: id}]
        })
        checkIsChatMessage.map((chatMessage) => {
            if(chatMessage.sender == id){
                userChatMessage.push(chatMessage.receive)
            }else{
                userChatMessage.push(chatMessage.sender)
            }
        })
        
        const user = await findUsers(userChatMessage)
        return {success: true, user: user , message: "Get user chat message successfully"}
    }catch (error){
        console.log(error)
        return {success: false, message:'Get User chat message', error: error}
    }
}


export default {
    sendMessageService,
    getMessageService,
    getAllUsersIsmessage
}