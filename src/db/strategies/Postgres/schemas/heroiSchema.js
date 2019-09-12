const Sequelize = require('sequelize')
const heroiSchema = {

  name: 'herois',

  schema: {
    id: {
      type: Sequelize.INTEGER,
      required: true,
      primaryKey: true,
      autoIncrement: true,
    },
    nome: {
      type: Sequelize.STRING,
      required: true,
    },
    poder: {
      type: Sequelize.STRING,
      required: true,
    },
  },
  options: {
    //opcoes para base existente
    tableName: 'TB_HEROIS',
    freezeTableName: false,
    timestamps: false,
  }
}
module.exports = heroiSchema;

// this._herois = this._sequelize.define(
//   'herois',
//   {
//     ,
//   {

//   },
// );