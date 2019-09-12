// npm i hapi
const Hapi = require('hapi');
const MongoDb = require('./db/strategies/MongoDb/mongoDbStrategy')
const Context = require('./db/strategies/base/contextStrategy')
const heroisSchema = require('./db/strategies/MongoDb/schemas/heroisSchema')

const app = new Hapi.Server({
  port: 5000
})

async function main() {

  const connection = MongoDb.connect()
  const context = new Context(new MongoDb(connection, heroisSchema))

  app.route([
    {
      path: '/herois',
      method: 'GET',
      handler: (request, head) => {
        return context.read()
      }
    }])

  await app.start()
  console.log('APi rodando na porta ', app.info.port)
}
main()