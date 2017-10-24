import Koa from 'koa'
import { Nuxt, Builder } from 'nuxt'
import R from 'ramda'
import { resolve } from 'path'

let config = require('../nuxt.config.js')
config.dev = !(process.env === 'production')

const r    = path => resolve(__dirname, path)
const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 2626
const MIDDLEWARTS = ['database','router']

class Server {
  constructor(){
    this.app = new Koa()
    this.useMiddleWares(this.app)(MIDDLEWARTS)
  }

  useMiddleWares(app){
    return R.map(R.compose(
      R.map(i => i(app)),
      require,
      i => `${r('./middlewares')}/${i}`
    ))
  }

  async start() {

    const nuxt = new Nuxt(config)

    this.app.use(ctx => {
      ctx.status = 200 

      return new Promise((resolve, reject) => {
        ctx.res.on('close', resolve)
        ctx.res.on('finish', resolve)
        nuxt.render(ctx.req, ctx.res, promise => {
          promise.then(resolve).catch(reject)
        })
      })
    })

    this.app.listen(port, host)
    console.log('Server listening on ' + host + ':' + port)
  }
}

const app = new Server()
app.start()



