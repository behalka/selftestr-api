const compose = require('koa-compose')
const koaStatic = require('koa-static2')
const Router = require('koa-router')
const path = require('path')

module.exports = compose([

  // Redirect /docs --> /docs/index.html
  new Router().redirect('/docs', '/docs/index.html').routes(),

  // Serves all swagger-ui static files (CSS, fonts, etc.)
  koaStatic('docs', path.join(__dirname, '../../../node_modules/swagger-ui/dist')),

  // Overrides swagger index HTML with the customized one
  koaStatic('docs', path.join(__dirname, '../../../docs')),
])
