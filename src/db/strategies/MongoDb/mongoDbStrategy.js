const IDb = require('../base/interfaceDb');
const Mongoose = require('mongoose')
const STATUS = {
  0: 'Disconectado',
  1: 'Conectado',
  2: 'Conectando',
  3: 'Disconectando'
}

class MongoDBStrategy extends IDb {
  constructor(connection, schema) {
    super()
    this._schema = schema
    this._connection = connection
  }

  async isConnected() {
    const state = STATUS[this._connection.readyState]
    if (state === 'Conectado') return state;

    if (state !== 'Conectando') return state
    await new Promise(resolve => setTimeout(resolve, 1000))

    return STATUS[this._connection.readyState]
  }

  /* defineModel() {
  /   const heroiSchema = new Mongoose.Schema({
  /     nome: {
  /       type: String,
  /       required: true
  /     },
  /     poder: {
  /       type: String,
  /       required: true
  /     },
  /     insertedAt: {
  /       type: Date,
  /       default: new Date()
  /     }
  /   })
  /   // this._schema = Mongoose.model('herois', heroiSchema)
  /   this._schema = Mongoose.models.herois || Mongoose.model('herois', heroiSchema)
}
  /*/
  //async connect
  static connect() {
    Mongoose.connect('mongodb://localhost:27017/herois', { auth: { user: 'admin', password: '123@abc' } }, function (error) {
      if (!error) return;
      console.log('Erro na conexão!', error)
    })

    const connection = Mongoose.connection
    connection.once('open', () => { console.log('Database rodando!') })

    return connection
  }

  create(item) {
    return this._schema.create(item)
  }

  read(item, skip = 0, limit = 10) { // limitar a 10 resultados, a partir de uma pagina especifica(skip)
    return this._schema.find(item).skip(skip).limit(limit)
    // return this._schema.find(item, { nome: 1, poder: 1, insertedAt: 1 })
  }
  update(id, item) {
    return this._schema.updateOne({ _id: id }, { $set: item }) // tirei o { item}
  }
  async delete(id) {
    //return 
    return this._schema.deleteOne({ _id: id })
  }
}

module.exports = MongoDBStrategy;


// --------------------------------------------------------------------------------------------------

// const ICrud = require('./base/interfaceDb')
// const Mongoose = require('mongoose')
// const STATUS = {
//     0: 'Disconectado',
//     1: 'Conectado',
//     2: 'Conectando',
//     3: 'Disconectando'
// }
// class MongoDB extends ICrud {
//     constructor() {
//         super()
//         this._schema = null
//         this._connection = null
//     }
//     async isConnected() {
//         const state = STATUS[this._connection.readyState]
//         if (state === 'Conectado') return state;

//         if (state !== 'Conectando') return state

//         await new Promise(resolve => setTimeout(resolve, 1000))

//         return STATUS[this._connection.readyState]

//     }
//     defineModel() {
//         const heroiSchema = new Mongoose.Schema({
//             nome: {
//                 type: String,
//                 required: true
//             },
//             poder: {
//                 type: String,
//                 required: true
//             },
//             insertedAt: {
//                 type: Date,
//                 default: new Date()
//             }
//         })

//         //mocha workaround
//         this._schema = Mongoose.models.herois || Mongoose.model('herois', heroiSchema)
//     }
//     connect() {
//         Mongoose.connect('mongodb://localhost:27017/herois', { auth: { user: 'admin', password: '123@abc' } }, function (error) {
//             if (!error) return;
//             console.log('Falha na conexão!', error)
//         })


//         this._connection = Mongoose.connection
//         this._connection.once('open', () => console.log('database rodando!!'))
//         this.defineModel()

//     }

//     async create(item) {
//         return this._schema.create(item)
//     }
//     async read(item = {}) {
//         return this._schema.find(item, { nome: 1, poder: 1, insertedAt: 1})
//     }
//     async update(id, item) {
//         return this._schema.updateOne({_id: id}, { $set: item})
//     }

//     async delete(id) {
//         return this._schema.deleteOne({_id: id})
//     }
// }

// module.exports = MongoDB