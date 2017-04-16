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

/* EDITOR */
/* Test models */
const testModels = new Router()
testModels.post('/', controllers.testModel.create)
testModels.patch('/:test_model_id', controllers.testModel.update)
testModels.delete('/:test_model_id', controllers.testModel.delete)

/* Question models */
const questionModels = new Router()
questionModels.get('/', controllers.questionModel.list)
questionModels.get('/:question_model_id', controllers.questionModel.get)
questionModels.post('/', controllers.questionModel.add)
questionModels.patch('/:question_model_id', controllers.questionModel.update)
questionModels.delete('/:question_model_id', controllers.questionModel.delete)

testModels.use('/:test_model_id/questions', questionModels.routes())
router.use('/editor', middleware.auth.isLogged(), testModels.routes())
/* EDITOR END */

/* TestModels - PUBLIC */
const tests = new Router()
tests.get('/testModels', controllers.testModel.list)
tests.get('/testModels/:test_id', controllers.testModel.getDetails)
tests.post('/testModels/:test_id/ratings',
  middleware.auth.fetchUser(), controllers.testModel.addRating)
tests.post('/testModels/:test_id/comments',
  middleware.auth.isLogged(), controllers.testModel.addComment)
// tests.delete('/testModels/:test_id/comment/:comment_id',
//   middleware.auth.isLogged(), controllers.testModel.deleteComment)
router.use(tests.routes())
/* TestModels - PUBLIC end */

/* Comments */
const comments = new Router()
comments.delete('/comments/:comment_id',
  middleware.auth.isLogged(), controllers.testModel.deleteComment)
router.use(comments.routes())

/* Test instances */
const testInstances = new Router({
  prefix: 'tests',
})
testInstances.get('/:test_instance_id/test', controllers.testInstance.testTimestamps)
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
testInstances.put('/:test_instance_id/result',
  middleware.auth.fetchUser(), controllers.testInstance.saveResults)
router.use(testInstances.routes())
/* Test instances END */

const routes = router.routes()
module.exports = routes
