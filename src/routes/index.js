const Router = require('koa-router')
const controllers = require('../controllers/index')
const middleware = require('../middleware/index')

const router = new Router()

// Status
router.get('/', controllers.status.getStatus)

// Sessions
router.post('/sessions', controllers.session.create)

// Users
router.post('/login', controllers.user.login)
router.post('/users', controllers.user.register)
router.post('/users/reset-password', controllers.user.resetPassword)

/* Test models */
const testModels = new Router()
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

router.use('/editor', middleware.auth.isLogged(), testModels.routes())

/* TestModels - basic */
const tests = new Router()
tests.get('/testModels', controllers.testModel.list)
tests.get('/testModels/:test_id', controllers.testModel.getDetails)
router.use(tests.routes())

/* Test instances */
const testInstances = new Router({
  prefix: 'tests',
})
/* Vygenerovat novy test */
testInstances.get('/models/:test_model_id',
  middleware.auth.fetchUser(), controllers.testInstance.generate)
/* Ziskat detail testu do historie */
testInstances.get('/:test_instance_id',
  middleware.auth.isLogged(), controllers.testInstance.get)
/* Ziskat agregovany vysledek pro instanci */
testInstances.get('/:test_instance_id/result',
  middleware.auth.isLogged(), controllers.testInstance.getResult)
/* Vygenerovany test pomoci mob. klienta */
testInstances.post('/',
  middleware.auth.fetchUser(), controllers.testInstance.add)
/* Ulozit vysledek testu */
testInstances.put('/:test_instance_id',
  middleware.auth.fetchUser(), controllers.testInstance.save)
router.use(testInstances.routes())

const routes = router.routes()
module.exports = routes
