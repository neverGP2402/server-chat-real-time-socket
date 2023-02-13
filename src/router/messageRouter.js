import express from 'express'
import messageController from '../controller/messageController.js'


const router = express.Router()

router.get('/api/messages/:from-:to', messageController.getMessageController)
router.post('/api/send-messages', messageController.sendMessageController)
router.get('/api/users-chat/:id', messageController.getUsersChatController)


export default router