import requestService from "../service/requestService";

const sendRequestController = async (req, res) => {

    const data = req.body
    const result = await requestService.sendRequestService(data)
    // console.log(result)
    return res.status(200).json(result)
    
}

const getRequestController = async (req, res) => {
    const id = req.params.id
    const result =await requestService.getRequestService(id)
    return res.status(200).json(result)
}

const getFollowingsController = async (req, res) => {
    const id = req.params.id
    const result = await requestService.getFollowingsService(id)
    return res.status(200).json(result)
}

const agreeController =async (req, res) => {
    const data = req.body
    const result = await requestService.agreeAddFriendService(data)
    return res.status(200).json(result)
}

const destroyFriendController =async (req, res) => {
    const data = req.body
    const result = await requestService.destroyFriendService(data)
    return res.status(200).json(result)
}

const getAllFriendController = async (req, res) => {
    const id = req.params.id
    const result = await requestService.getAllFriendService(id)
    return res.status(200).json(result)
}

const deleteRequestController = async (req, res) => {
    const data = req.body
    const result = await requestService.deleteRequest(data)
    return res.status(200).json(result)
}



export default {
    sendRequestController,
    getFollowingsController,
    getRequestController,
    agreeController,
    destroyFriendController,
    getAllFriendController,
    deleteRequestController
}

