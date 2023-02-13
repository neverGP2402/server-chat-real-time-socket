import Users from '../model/Users'
import bcrypt from 'bcrypt'
import JWT from '../middleware/token/jsonwebtoken'

const select = '_id name email avatar username isAdmin googleId facebookId deleteAt gender birthday setting'
const salt = bcrypt.genSaltSync(10)
const hashPassword = async (password) => {
    try {
        const hashPassword = await bcrypt.hashSync(password, 10)
        return hashPassword
    } catch (error) {
        console.log(error)
        return false
    }
}

// post request
const loginService =  async(data) => {
    const {email, password} = data
    if (!email || !password) {
        return {success:false, message:'Missing required information',user:[]}
    }
    try {
        const checkUser = await Users.findOne({email: email})//.select('_id name email avatar facebookId googleId password')
        if(!checkUser) {
            return {success:false, message:'Email address is not correct',user:[]}
        }
        const comparePassword = await bcrypt.compareSync(password,checkUser.password)
        if (comparePassword){
            return {success: true, user: checkUser, message: 'Login successful'}
        }else{
            return {success: false, user: [], message: 'Password is not correct'}
        }
    } catch (error) {
        console.log(error)
        return {success:false, message:'Login not successful', user:[]}
    }
}

const registerService = async (data) => {
    const {name, email, password, username} = data
    if (!email || !password || !name || !username) {
        return {success: false, message:'Missing required parameters'}
    }
    try {
        const checkUser = await Users.findOne({email: email})
        const hasPassword = hashPassword(password)
        if(checkUser) {
            return {success: false, message: 'User already exists',user:[]}
        }
        const newUser = await Users.create({
            email: email,
            password: hasPassword,
            name: name,
            username
        })
        newUser.save()
        const token = JWT.enCodeToken(newUser._id)
        console.log(token)
        const user = {
            email:newUser.email, 
            name:newUser.name, 
        }
        return {success: true, message: 'registered successfully', user: user, token: token}

    } catch (error) {
        console.log(error)
        return {success: false,user:[], message: 'Register not successful' }
    }
}

// update request
const setAvatarService = async(id, avatar) => {
    if(!id){return {success: false,user:[],message: 'Can not find user'}}
    if(!avatar){return {success: false,user:[],message:'Avatar not found'}}
    try {
        const user = await Users.findById(id).select(select)
        if(user){
            await Users.findOneAndUpdate({_id: id}, {avatar: avatar})
            return {success: true,message: 'Upload avatar successfully', user: user}
        }
        return {success: false,message:'User not exist'}
    } catch (error) {
        console.log(error)
        return {success: false,message: 'Upload avatar failed'}
    }
}

const updateUserService = async (data) => {
    if(!data.id) {return{success: false, message: 'Missing id parameter'}}
    try{
        const user = await Users.findOneAndUpdate({_id: data.id},{
            name: data.name,
            phone: data.phone,
            birthday: data.birthday,
            gender: data.gender,
            address: data.address,
            avatar: data.avatar,
        })
        if(user){return {success: true,message: 'Updated information user successfully', user:user}}
        if(!user){return {success: false,message: 'Updated information user failed, please try again'}}

    }catch (error) {
        console.log(error)
        return {success: false, message: 'Update user failed'}
    }
}


// get request 
const getUsersService = async(type) => {
    if(!type) {return {success: false, message:"Not find type"}}
    try {
        if(type==='all'){
            const users = await Users.find().select(select)
            
            return {success: true, message: "Get users successfully", user: users} 
        }
        const user = await Users.findById(type).select(select)
        if(user){return {success: true, message: "Get user successfully", user: user}}
        else{return {success: false, message: "Can't find user", user:user}}
    } catch (error) {
        console.log(error)
        return {success: false, message:'Get users failed'}
    }
    
}

const getFriendService =  async (data) => {
    if(!data){ return {success: false, message:'Missing Parameters'}}
    try {
        const user = await Users.findOne({
            $or: [{email: data},{username: data}]
        }).select(select)
        if(user){return {success: true, message:'Get user successfully', user:user}}
        if(!user){return {success: false, message:'User does not exist'}}
    } catch (error) {
        console.log(error)
        return {success: false, message: 'Find users failed'}
    }
}

// delete (soft erase) method = update
const softEraseUserService = async (id) => {
    if(!id) {return{success: false, message: 'Missing id parameter'}}
    try{
        const deleteResult = await Users.findOneAndUpdate({_id:id}, {
            deleteAt: new Date(),
        })
        if(deleteResult) return {success: true, message:'Delete was successful'}
        else{
            return {success: false, message:'Delete user not found, please try again or contact the administrator'}
        }
    }catch (error) {
        console.log(error)
        return {success: false, message: 'Delete user failed'}
    }
}

// delete (permanenlty delete)

const deleteUserService = async (id) => {
    if(!id) {return{success: false, message: 'Missing id parameter'}}
    try{
        const resultDestroy = await Users.findOneAndDelete({_id:id})
        if(resultDestroy) return {success: true, message: 'Delete user successfully'}
        else {return {success: false, message: 'Delete user failed, please try again or contact the administrator'}}
    }catch (error) {
        console.log(error)
        return {success: false, message: 'Delete user failed'}
    }
}

const replacePasswordService = async (data) => {
    const {email, password, passwordReplace, confirmPasswordReplace} = data
    if(!email || !password || !passwordReplace || !confirmPasswordReplace) return {success: false, message:"Please enter all parameters"}
    try {
        const findUser = await Users.findOne({
            email: email,
        })
       if(!findUser) return {success: false, message: 'Email address not exist'}
       else{
        const comparePassword = await bcrypt.compareSync(password,findUser.password)
        if(!comparePassword) return {success: false, message:'Password not matches'}
        else{
            const hashPass = await hashPassword(password)
            const resultReplace = await Users.findOneAndUpdate({
                email: email,
            },{
                password: hashPass,
            })
            if(!resultReplace) return {success: false, message: 'Replace password failed, please try again'}
            else return {success: true, message: 'Replace password was successfully replaced'}
        }
       }

    } catch (error) {
        console.log(error)
        return {success: false, message: 'Replace password failed'}
    }
}

const getUserDeletesoftService = async () => {
    try {
        const user = await Users.find({deletedAt: !null})
    } catch (error) {
        console.log(error)
        return {success: false, message: 'Get user deleted failed'}
    }
}

export default {
    registerService,
    loginService,
    setAvatarService,
    getUsersService,
    getFriendService,
    updateUserService,
    softEraseUserService,
    deleteUserService,
    replacePasswordService
}