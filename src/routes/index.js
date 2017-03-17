const Router = require('koa-router')
const controllers = require('../controllers/index')

const router = new Router()

// Status
router.get('/', controllers.status.getStatus)

// Sessions
router.post('/sessions', controllers.session.create)

// Users
router.post('/users', controllers.user.register)
router.post('/users/reset-password', controllers.user.resetPassword)

/* Test models */
const testModels = new Router({
  prefix: 'editor',
})
testModels.get('/', controllers.testModel.list)
testModels.get('/:test_id', controllers.testModel.get)
testModels.post('/', controllers.testModel.create)
testModels.patch('/:test_id', controllers.testModel.update)

const questionModels = new Router()
questionModels.get('/', controllers.questionModel.list)
questionModels.post('/', controllers.questionModel.add)
questionModels.put('/:question_id/answers', controllers.questionModel.setAnswers)
questionModels.get('/:question_id', controllers.questionModel.get)
questionModels.delete('/:question_id', controllers.questionModel.delete)
questionModels.patch('/:question_id', controllers.questionModel.update)

testModels.use('/:test_id/questions', questionModels.routes())
router.use(testModels.routes())

/* Test instances */
const testInstances = new Router({
  prefix: 'tests',
})
testInstances.get('/models/:test_model_id', controllers.testInstance.generate)
testInstances.get('/:test_instance_id', controllers.testInstance.get)
testInstances.post('/', controllers.testInstance.add)
testInstances.put('/:test_instance_id', controllers.testInstance.save)
router.use(testInstances.routes())

const routes = router.routes()
module.exports = routes
