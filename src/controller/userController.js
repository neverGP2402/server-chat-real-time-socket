import userService, {} from '../service/userService'


const loginController = async(req, res) => {
    const data = req.body
    const user = await userService.loginService(data)
    return res.status(200).json(user)
}

const registerController = async(req, res) => {
    const data = req.body
    const newUser = await userService.registerService(data)
    // res.setHeader('authentication', newUser.token)
    return res.status(200).json(newUser)
}

const setAvatarController = async(req, res) => {
    const id = req.params.q
    const avatar = req.body.avatar
    const result = await userService.setAvatarService(id, avatar)
    return res.status(200).json(result)
}

const getUsersController = async (req, res) => {
    const type = req.params.type
    const result = await userService.getUsersService(type)
    return res.status(200).json(result)
}


const getFriendController = async (req, res) => {
    const data = req.body.data
    const result = await userService.getFriendService(data)
    return res.status(200).json(result)
}

const updateUserController = async (req, res) => {
    const data = req.body
    const result = await userService.updateUserService(data)
    return res.status(200).json(result)
}

const secretController =  (req, res) => {
    return res.status(200).json({secret: true})
}

export default {
    loginController,
    registerController,
    setAvatarController,
    getUsersController,
    getFriendController,
    updateUserController,
    secretController
}