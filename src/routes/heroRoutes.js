// Nao comentado é a correção, o comentado foi eu que fiz mas deu algum erro

// const BaseRoute = require('./base/base.route')
// const boom = require('boom')
// const failAction = (request, headers, erro) => { // "Mostra onde está o erro"
//   throw erro
// }
// const Joi = require('joi')

// class HeroRoutes extends BaseRoute { // com extends, ele tambem traz o metodo do baseRoute pra cá
//   constructor(db) {
//     super() // chama a classe PAI primeiro, antes de setar qualquer coisa
//     this.db = db
//   }

//   list() {
//     return {
// /*   */  path: '/herois',
// /*   */  method: 'GET',
// /*   */  config: {
// /* P */    validate: {
// /* A */      // responsavel por validar o corpo da nossa requisicao
// /* R */      // validar payload = body da requisicao
// /* E */      // header =  cabeçalho da requisicao
// /* D */      // params = pra validadar o que vem da url
// /* Ã */      // query = validar o skip=0&limit=10
// /* O  */       failAction,
// /*    */      query: { // schema pra validar a requisição
//             skip: Joi.number().integer().default(0), // limita o skip, padrao 0
//             limit: Joi.number().integer().default(10), // limita a quantidade de paginas, padrao 10
//             nome: Joi.string().min(3).max(100)
//           }
//         }
//       },
//       /* Se passar, vai pro handler */
//       handler: (request, headers) => {

//         try {
//           const {
//             skip,
//             limit,
//             nome
//           } = request.query

//           const query = nome ? {
//             $regex: `.*${nome || ""}*.`
//           } : {}

//           return this.db.read(nome ? query : {}, skip, limit)

//         } catch (error) {
//           console.log('Deu Ruim ---------> ', error)
//           return boom.internal()
//         }
//       }
//     }
//   }

//   create() { // Quando tiver na /herois, no metodo post
//     return {
//       path: '/herois',
//       method: 'POST',
//       config: {
//         validate: {
//           failAction,
//           payload: {
//             nome: Joi.string().required().min(3).max(100),
//             poder: Joi.string().required().min(2).max(100)
//           }
//         }
//       },
//       handler: async (request) => {
//         try {
//           //extrair dados do request.payload
//           const { nome, poder, } = request.payload
//           const result = await this.db.read({ nome, poder })

//           console.log('result', result)
//           return {
//             message: 'Heroi cadastrado com sucesso',
//           }
//         } catch (error) {
//           console.log('Deu ruim', error)
//           return boom.internal()
//         }

//       }
//     }
//   }

//   update() {
//     return {
//       path: '/herois/{id}',
//       method: 'PATCH',
//       config: {
//         validate: {
//           params: {
//             id: Joi.string().required()
//           },
//           payload: {
//             nome: Joi.string().min(3).max(100),
//             poder: Joi.string().min(3).max(100)
//           }
//         }
//       },
//       handler: async (request) => {
//         try {
//           const {
//             id
//           } = request.params

//           const { payload } = request

//           const dadosString = JSON.stringify(payload)
//           const dados = JSON.parse(dadosString)

//           const result = await this.db.update(id, dados)

//           if (result.nModified !== 1) return boom.preconditionFailed('Id nao encontrado no banco')

//           console.log('result', result)
//           return {
//             message: 'Heroi atualizado com sucesso'
//           }
//         } catch (error) {
//           console.log("Deu ruim", error)
//           return boom.internal()
//         }
//       }
//     }
//   }

//   delete() {
//     return {
//       path: '/herois/${id}',
//       method: 'DELETE',
//       config: {
//         validate: {
//           failAction,
//           params: {
//             id: Joi.string().required()
//           }
//         }
//       },
//       handler: async (request) => {
//         try {
//           const { id } = request.params
//           const result = await this.db.delete(id)

//           if (result.n !== 1)
//             return {
//               message: 'Não foi possivel remover o item'
//             }
//           return {
//             message: 'Heroi removido com sucesso!'
//           }
//         } catch (error) {
//           console.log('Deu ruim ', error)
//           return boom.internal()
//         }
//       }
//     }
//   }
// }
// module.exports = HeroRoutes;
// //Hapi.js por padrão ja resolve promises, nao precisa de async/await

// --------------------------------------------------------------------------------------------------------------------------

const BaseRoute = require('./base/base.route')
const Joi = require('joi')


const headers = Joi.object({  // todas as rotas usarao esse header pra verificar se o corpo da requisição esta de acordo
  authorization: Joi.string().required()
}).unknown()


class HeroRoutes extends BaseRoute {
  constructor(db) {
    super()
    this.db = db
  }



  list() {
    return {
      path: '/herois',
      method: 'GET',
      config: {
        tags: ['api'],
        description: 'Deve listar herois',
        notes: 'Pode paginar os resultador e filtrar por nome',
        validate: {
          query: {
            skip: Joi.number().integer().default(0), // limita o skip, padrao 0
            limit: Joi.number().integer().default(10), // limita a quantidade de paginas, padrao 10
            nome: Joi.string().min(3).max(100)
          },
          headers,
        }
      },
      handler: (request, headers) => {
        return this.db.read()
      }
    }
  }
  create() {
    return {
      path: '/herois',
      method: 'POST',
      config: {
        tags: ['api'],
        description: 'Deve Cadastrar heroi',
        notes: 'Deve cadastrar heroi por nome e poder',
        validate: {
          failAction: (request, h, err) => {
            throw err;
          },
          headers,
          payload: {
            nome: Joi.string().max(100).required(),
            poder: Joi.string().max(30).required()
          },
        },
      },

      handler: (request, headers) => {
        const payload = request.payload
        return this.db.create(payload)
      }
    }
  }
  update() {
    return {
      path: '/herois/{id}',
      method: 'PATCH',
      config: {
        tags: ['api'],
        description: 'Deve atualizar herois',
        notes: 'Deve atualizar os herois, nome e poder',
        validate: {
          failAction: (request, h, err) => {
            throw err;
          },
          params: {
            id: Joi.string().required()
          },
          headers,
          payload: {
            nome: Joi.string().max(100),
            poder: Joi.string().max(30)
          },
        },

      },
      handler: (request, headers) => {
        const payload = request.payload;
        const id = request.params.id;
        return this.db.update(id, payload)
      }
    }
  }
  delete() {
    return {
      path: '/herois/{id}',
      method: 'DELETE',
      config: {
        tags: ['api'],
        description: 'Deve remover herois por id',
        notes: 'Deve remover heroi atraves de id passado',
        validate: {
          failAction: (request, h, err) => {
            throw err;
          },
          headers,
          params: {
            id: Joi.string().required()
          }
        }
      },
      handler: (request, headers) => {
        const id = request.params.id;
        return this.db.delete(id)
      }
    }
  }

}

module.exports = HeroRoutes