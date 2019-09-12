const BaseRoute = require('./base/base.route')
const Joi = require('joi')
const boom = require('boom')

// npm i jsonwebtoken
const jwt = require('jsonwebtoken')

const failAction = (request, headers, erro) => {
  throw erro
}


const USER = {
  username: 'xuxadasilva',
  password: '123'
}


class AuthRoutes extends BaseRoute { // baseRoute tem metodos uteis pra saber os nomes dos metodos

  constructor(secret) {
    super()
    this.secret = secret
  }

  login() {
    return {
      path: '/login',
      method: 'POST',
      config: {
        auth: false,
        tags: ['api'],
        description: 'Obter token',
        notes: 'Faz login com user e senha do banco',

        validate: {
          failAction,

          payload: {
            username: Joi.string().required(),
            password: Joi.string().required()
          }

        }
      },
      handler: async (request) => {
        const { username, password } = await request.payload

        if (username.toLowerCase() !== USER.username || password !== USER.password) {
          return boom.unauthorized()
        }

        const token = jwt.sign({
          username: username,
          id: 1
        }, this.secret) // precisa de uma chave privada, vai ser usada em todos os lugares. DEFINIR NO CONSTRUCTOR
        return {
          token
        }

      }
    }
  }

}

module.exports = AuthRoutes