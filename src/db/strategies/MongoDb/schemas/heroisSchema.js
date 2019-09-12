const Mongoose = require('mongoose')

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
    default: new Date()
  }
})
// this._herois = Mongoose.model('herois', heroiSchema)
module.exports = this._herois = Mongoose.models.herois || Mongoose.model('herois', heroiSchema)