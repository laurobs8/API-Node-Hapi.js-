const assert = require('assert')
const API = require('./../api')
let app = {}

describe.only('Auth test suíte', function () {

  this.beforeAll(async () => {
    app = await API // quando o servidor estiver no ar, ele começa os testes
  })

  it('Deve obter um token', async () => { // 1° coisa:  Preciso de um token
    const result = await app.inject({
      method: 'POST',
      url: '/login',
      payload: {
        username: 'XuxadaSilva',
        password: '123'
      }
    })
    const statusCode = result.statusCode
    const dados = JSON.parse(result.payload)

    // console.log('------------------request------------------', result)

    assert.deepEqual(statusCode, 200)
    assert.ok(dados.token.length > 10)

  })
})