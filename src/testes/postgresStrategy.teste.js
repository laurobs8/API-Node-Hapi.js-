const assert = require('assert') //validar as variaveis
const Postgres = require('../db/strategies/Postgres/postgresSQLStrategy')
const Context = require('../db/strategies/base/contextStrategy')
const HeroiSchema = require('./../db/strategies/Postgres/schemas/heroiSchema')

// const context = new Context(new Postgres())

const MOCK_HEROI_CADASTRAR = { nome: 'Tigalacatiga', poder: "flexa" }
const MOCK_HEROI_ATUALIZAR = { nome: 'Pedra', poder: "Força" }

let context = {}
describe('Postgres Strategy', function () {
  this.beforeAll(async function () {
    const connection = await Postgres.connect()
    const model =  await Postgres.defineModel(connection,HeroiSchema)

    context = new Context(new Postgres(connection, model))
    await context.delete()
    await context.create(MOCK_HEROI_ATUALIZAR)
  })
  this.timeout(Infinity)

  it('PostgresSql Connection', async function () {
    const result = await context.isConnected()

    assert.equal(result, true)
  })

  it('Cadastrar', async function () {
    const result = await context.create(MOCK_HEROI_CADASTRAR)
    delete result.id
    assert.deepEqual(result, MOCK_HEROI_CADASTRAR)
  })

  it('Listar', async function () {
    const [result] = await context.read({
      nome: MOCK_HEROI_CADASTRAR.nome
    })
    delete result.id
    assert.deepEqual(result, MOCK_HEROI_CADASTRAR)
  })

  it('Atualizar', async function () {
    const [itemAtualizar] = await context.read({ nome: MOCK_HEROI_ATUALIZAR.nome })
    const novoItem = {
      ...MOCK_HEROI_ATUALIZAR, // quebra em chaves
      nome: 'Mulher maravilha'
    }
    const [result] = await context.update(itemAtualizar.id, novoItem)
    const [itemAtualizado] = await context.read({ id: itemAtualizar.id })
    assert.deepEqual(result, 1)
    assert.deepEqual(itemAtualizado.nome, novoItem.nome)

    /*
    MOCK_HEROI_ATUALIZAR ficaria: 
    MOCK_HEROI_ATUALIZAR

    ...MOCK_HEROI_ATUALIZAR ficaria:
    MOCK_HEROI_ATUALIZAR.nome e MOCK_HEROI_ATUALIZAR.poder


      No javascript, temos uma tecnica chamada rest/spread que é um metodo usado para mergear objetos
      ou separar
      {
        nome: batman
        poder: dinheiro
      }
      {
        datanascimento: 12/12/12
      }

      final teria que ficar:
      {
        nome: batman
        poder: dinheiro
        datanascimento: 12/12/12
      }
    */
  })
  it('remover por Id', async function(){
    const [item] = await context.read({})
    const result = await context.delete(item.id)

    assert.deepEqual(result, 1)
  })
})