import Router from 'koa-router'
import controllers from '../controllers'

const router = new Router()

// Status
router.get('/', controllers.status.getStatus)

// Sessions
router.post('/sessions', controllers.session.create)

// Users
router.post('/users', controllers.user.register)
router.post('/users/reset-password', controllers.user.resetPassword)

// Tests - questions
router.post('/tests/:test_id/questions', controllers.test.addQuestion)
router.delete('/tests/:test_id/questions/:question_id', controllers.test.deleteQuestion)
router.patch('/tests/:test_id/questions/:question_id', controllers.test.updateQuestion)

// Tests - general
router.get('/tests/:test_id', controllers.test.get)
router.get('/tests', controllers.test.list)
router.post('/tests', controllers.test.create)

const routes = router.routes()
export default routes
