import Router from 'koa-router'
import controllers from '../controllers/index'

const router = new Router()

// Status
router.get('/', controllers.status.getStatus)

// Sessions
router.post('/sessions', controllers.session.create)

// Users
router.post('/users', controllers.user.register)
router.post('/users/reset-password', controllers.user.resetPassword)

// Test models - questions
router.post('/tests/:test_id/questions', controllers.questionModel.add)
router.delete('/tests/:test_id/questions/:question_id', controllers.questionModel.delete)
router.patch('/tests/:test_id/questions/:question_id', controllers.questionModel.update)

// Test models - general
router.get('/tests/:test_id', controllers.testModel.get)
router.get('/tests', controllers.testModel.list)
router.post('/tests', controllers.testModel.create)
router.patch('/tests/:test_id', controllers.testModel.update)

const routes = router.routes()
export default routes
