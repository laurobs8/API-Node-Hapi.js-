class BaseRoute {
  static methods() {  // todos que forem usar essa classe, estende a esse metodo. Ele vai ter automaticamente a implementação desse metodo
    return Object.getOwnPropertyNames(this.prototype) // this.prototype ele "fala": quais sao os metodos/membros da classe
      // pega todos os nomes de propriedades que estão no this.prototype
      .filter(method => method !== 'constructor' && !method.startsWith("_")) // dos metodos que encontrou, me traga um metodo que seja diferente do construtor. Pq se tiver algo dentro de membro da classe pode ter problema
    // [Linha acima]. Se esse metodo for um construtor, ele nao retorna. E se começar com _antes, é uma metodo provado, e tambem nao retorna
  }
}

module.exports = BaseRoute