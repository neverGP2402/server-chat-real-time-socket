import express from 'express'
import userController from '../controller/userController.js'
import requestController from '../controller/RequestController'
import validateRequest from '../middleware/validate/validateRequest'
import passport from 'passport'
import ConfigPassport from '../middleware/passport'
const router = express.Router()

// expample validate params
//router.get('/api/example/:IdExpample', (validateRequest.validateParam(validateRequest.schemas.idSchema,'IdExpample'), exampleController.getExample) )

router.post('/api/register', userController.registerController)
router.post('/api/login', userController.loginController)
router.post('/api/set-avatar/:q', userController.setAvatarController)
router.get('/api/users/:type', userController.getUsersController)
router.put('/api/update-info', userController.updateUserController)
router.post('/api/get-friend', userController.getFriendController)


// secret test

router.get('/secret',passport.authenticate('jwt', {session: false}), userController.secretController)

// friend
router.put('/api/agree-add-friend', requestController.agreeController)
router.post('/api/send-request-add-friend', requestController.sendRequestController)
router.get('/api/followers/:id', requestController.getRequestController)
router.get('/api/following/:id', requestController.getFollowingsController)
router.delete('/api/delete-friend', requestController.destroyFriendController)
router.get('/api/list-friend/:id', requestController.getAllFriendController)
router.delete('/api/delete-request', requestController.deleteRequestController)

export default router