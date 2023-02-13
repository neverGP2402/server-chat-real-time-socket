import RequestAddFriend from "../model/RequestAddFriend";
import Users from "../model/Users";

const select = '_id name email avatar username isAdmin googleId facebookId deleteAt gender birthday setting'

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

const sendRequestService = async (data) => {
    const {userSendRequest,userReceived} = data
    if(!userSendRequest || !userReceived) {return {success: false, message: 'Missing params id user received or user send request'}}
    try {
        const checkIsFriend = await RequestAddFriend.findOne({
            $or: [
                {
                    sender: userSendRequest, 
                    received: userReceived,
                    isFriend: true,
                },
                {
                    sender: userReceived, 
                    received: userSendRequest,
                    isFriend: true,
                }
            ]
        })
        if(checkIsFriend) {
            return {success: false, message: 'Your and this peple is friend'}
        }else{
            const checkIsSendRequest = await RequestAddFriend.findOne({
                $or: [
                    {
                        sender: userSendRequest, 
                        received: userReceived,
                        isFriend: false,
                    },
                    {
                        sender: userReceived, 
                        received: userSendRequest,
                        isFriend: false,
                    }
                ]
            })
            if(checkIsSendRequest){
                return {
                    success:false, 
                    message: 'This peple or you is send request add friend, please check agan'
                }
            }else{
                const newRequest = await RequestAddFriend.create({
                    sender: userSendRequest,
                    received: userReceived,
                })
                
                if(newRequest) {
                    return {success: true, message: 'Send request was successful'}
                }
                else {return {success: false, message: 'Send request not successful'}}
            }
        }
        
        
    } catch (error) {
        console.log(error)
        return {success: false, message: 'Send request failed'}
    }
}

const getRequestService = async (idUser) => {
    if(!idUser) {return {success: false, message: 'Missing id user'}}
    const idSender = []
    try{
        const request = await RequestAddFriend.find({
            received: idUser,
            isFriend: false,
        })

        request.map((item)=>{
            idSender.push(item.sender) 
        })
        const users = await findUsers(idSender)
        return {success: true, message: 'Get request was successful', user: users,}
    }catch (error) {
        console.log(error)
        return {success: false, message: 'Get request add friend failed'}
    }
}

const getFollowingsService = async (idSenderRequest) => {
    if(!idSenderRequest) {return {success: false, message: 'Missing id sender request'}}
    const idUserReceiveds = []
    try{
        const followings = await RequestAddFriend.find({
            sender: idSenderRequest,
            isFriend: false
        })
        // console.log(followings[0].sender)
        followings.map((item)=>{
            idUserReceiveds.push(item.received)
        })
        // console.log(idUserReceiveds)
        const users = await findUsers(idUserReceiveds)

        return {success: true, message: 'Get followings successfully', user: users}
    }catch (error) {
        console.log(error)
        return {success: false, message: 'Get following failed'}
    }
}

const agreeAddFriendService = async (data) => {
    const {idSenderRequest, idReceivedRequest} = data
    if (!idReceivedRequest || !idSenderRequest) {return {success: false, message: 'Missing id sender/received request'}}
    try{
        const isFriend = await RequestAddFriend.findOneAndUpdate({
            sender: idSenderRequest,
            received: idReceivedRequest,
            isFriend: false
        },{
            sender: idSenderRequest,
            received: idReceivedRequest,
            isFriend: true
        })
        if (!isFriend) {return {success: false, message: 'Add friend failed you and this person is friend already'}}
        if(isFriend) {return {success: true, message: 'Add friend succeeded', data: isFriend}}
    }catch (error){
        console.log(error)
        return {success: false, message: 'Add friend failed'}
    }
}

const destroyFriendService = async (data) => {
    const {idSenderRequest, idReceivedRequest} = data
    if (!idReceivedRequest || !idSenderRequest) {return {success: false, message: 'Missing id sender/received request'}}
    try{
        const deleteFriend = await RequestAddFriend.findOneAndDelete({
            sender: idSenderRequest,
            receivedRequest: idReceivedRequest,
            isFriend: true,
        })
        if (!deleteFriend) {return {success: false, message: 'Delete friend failed please try again'}}
        return {success: true, message: 'Delete friend successfully', data: deleteFriend}
    }catch (error){
        console.log(error)
        return {success: false, message: 'Delete friend failed'}
    }
}

const getAllFriendService = async (id)=>{
    if(!id) {return {success: false, message: 'Missing id requested'}}
    const idUser = []
    try{
        const friend = await RequestAddFriend.find({
            $or:[{sender: id, isFriend:true}, {received: id, isFriend:true}]
        })
        friend.map((item)=>{
            if(id == item.sender){
                idUser.push(item.received)

                console.log('sender',item.sender)
            }else{
                idUser.push(item.sender)
            }
        })
        const users = await findUsers(idUser)
        return {success:true, message: 'Get list friends successfully', user:users}
        
    }catch (error){
        console.log(error)
        return {success: false, message: 'Get friend failed please try again'}
    }

}

const deleteRequest = async (data) => {
    const {idSender, idReceived} = data 
    if(!idSender || !idReceived) {return {success:false, message: 'Missing id sender or id received'}}
    try {
        const result = await RequestAddFriend.findOneAndDelete({
            sender:idSender,
            received:idReceived,
            isFriend: false
        })
        if(result) {return{success:true, message: 'Delete request add friend successfully'}}
        else{return {success: false, message:'Delete request add friend not successfully'}}
    }catch(error){
        console.log(error)
        return {success: false, message: 'Delete request fail'}
    }
    
}

export default {
    sendRequestService, 
    getFollowingsService,
    getRequestService,
    destroyFriendService,
    agreeAddFriendService,
    getAllFriendService,
    deleteRequest
}