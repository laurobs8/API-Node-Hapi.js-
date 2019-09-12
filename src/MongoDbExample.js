// npm install mongoose
const Mongoose = require('mongoose')

Mongoose.connect('mongodb://localhost:27017/herois', { auth: { user: 'admin', password: '123@abc' } }, function (error) {
  if (!error) return;
  console.log('Erro na conexão!', error) // Se tentar conectar e nao consegui, cairá aqui
}, { useNewUrlParser: true })

// caso tenha conexão...
const connection = Mongoose.connection // Com essa conexão, ele emite alguns eventos
// Pra pegar pelo evento
connection.once('open', () => console.log('Database rodando!')) // once => emitir esse evento apenas uma vez

// setTimeout(() => {
//   const state = connection.readyState
//   console.log('state: ', state)

// }, 1000)
/*
states:
0:Desconectado
1:Conectado
2:Conectando
3:Disconectando
*/
// -----------------------------------CONEXÃO COM O BANCO----------------------------------------------------------------
// Mongoose tem schemas

const heroiSchema = new Mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  poder: {
    type: String,
    required: true
  },
  insertedAt: {
    type: Date,
    default: new Date() // toda vez que salvar, salva com a data atual
  }
})

const model = Mongoose.model('herois', heroiSchema)

async function main() {
  const resultCadastrar = await model.create({
    nome: 'Batman',
    poder: 'Dinheiro'
  })
  console.log('result cadastrar ', resultCadastrar)
  // result cadastrar  {
  //   insertedAt: 2019-08-06T13:15:18.613Z,  --> Mongoose tira o ObjectId
  //   _id: 5d497d66abd1342a9822d2b6,
  //   nome: 'Batman',
  //   poder: 'Dinheiro',
  //   __v: 0                                 --> coloca isso pra saber a versao do documento e fazer o gerenciamento
  // }
  
  const listItens = await model.find()
  console.log('Itens', listItens)
}
main()