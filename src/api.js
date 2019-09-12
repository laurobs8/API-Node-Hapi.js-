// npm i hapi
// npm i hapi-auth-jwt2
const Hapi = require('hapi');
const MongoDb = require('./db/strategies/MongoDb/mongoDbStrategy')
const Context = require('./db/strategies/base/contextStrategy')
const heroisSchema = require('./db/strategies/MongoDb/schemas/heroisSchema')
const HeroRoute = require('./routes/heroRoutes')
const AuthRoute = require('./routes/authRoutes')

const HapiJwt2 = require('hapi-auth-jwt2')// pacote com funcao de interceptar todas as requisições, afim de certificar que todas as chamadas tem que ter um token valido
const HapiSwagger = require('hapi-swagger')
const vision = require('vision')
const inert = require('inert')

const JWT_SECRET = 'MEU_SEGREDAO_123'

const app = new Hapi.Server({
  port: 5000
})

function mapRoutes(instance, methods) {
  return methods.map(methods => instance[methods]()) // trará uma lista de metodos dinamicamente
}

async function main() {

  const connection = MongoDb.connect()
  const context = new Context(new MongoDb(connection, heroisSchema))

  // console.log('Map Routes', mapRoutes(new HeroRoute(context), HeroRoute.methods())) 
  // acima, traz todas as rotas do heroRoutes

  app.route([
    ...mapRoutes(new HeroRoute(context), HeroRoute.methods()),
    ...mapRoutes(new AuthRoute(JWT_SECRET), AuthRoute.methods()) // => Pega a instancia do authRoute, recebe JWT SECRET e passa o heroRoute.method pq herda da mesma classe base do heroRoute
    // irá retornar uma lista
    // Agrupa todos os metodos, todas as rotas (acima) depois vai adicionando em apenas uma unica pasta os dados que a gente precisa
    // e ja vai colocando as rotas dinamicamente 
  ])

  const swaggerOptions = {
    info: {
      title: "API Herois - #CursoNodeBr",
      version: 'v1.0'
    },
    lang: 'pt'
  }

  await app.register([ // 1º passo do swagger =>  Registrar os plugins
    HapiJwt2, // registra aqui
    vision,
    inert,
    {
      // plugin customizado, pois o swagger nao é mantido pelo hapi.js, portanto segue o outro padrao
      // pra que a gente consiga comunicar ele com o hapi.js

      plugin: HapiSwagger,
      options: swaggerOptions
    }
  ]) // => pra que serve?   Usado pra registrar modulos e ele se comunicar com os modulos que ja tenho

  app.auth.strategy('jwt', 'jwt', {// criar uma estrategia de autenticação. Passara por aqui obrigatoriamente. ('estrategia de autenticação', 'usar um schema', objeto)
    key: JWT_SECRET, // toda vez que vier o token, vou tentar descriptografar, pra validar as informações do conteudo dessw objeto estão corretos


    validate: (dado, request) => {
      // verifica no banco se o usuario continua ativo/pagando
      return {
        isValid: true // caso nao valido -> false
      }
    }
  })
  app.auth.default('jwt')
  
  await app.start()
  // console.log('APi rodando na porta ', app.info.port)

  return app
}
module.exports = main()


// --------------------

// aula do swagger

// npm i vision inert hapi-swagger

// Instalar esses tres modulos pra que gere automaticamente um front-end
// com todas as apis baseado no que ja temos de ROTAS