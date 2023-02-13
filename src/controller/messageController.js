import messageService from '../service/messageService'

const sendMessageController = async(req, res) => {
    const data = req.body
    console.log('send',data)
    const result = await messageService.sendMessageService(data)
    return res.status(200).json(result)
}

const getMessageController = async(req, res) => {
    const data = req.params
    const result = await messageService.getMessageService(data)
    return res.status(200).json(result)
}

const getUsersChatController = async(req, res) => {
    const id = req.params.id
    const result = await messageService.getAllUsersIsmessage(id)
    return res.status(200).json(result)
}


export default {
    sendMessageController,
    getMessageController,
    getUsersChatController
}