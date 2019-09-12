// docker ps
// docker exec -it 0ed396a83485 mongo -u admin -p 123@abc --authenticationDatabase herois

// database
show dbs
// mudando contexto para uma database
use herois
// mostrar tables (colecoes)
show collections

db.herois.insert({
  nome: 'Flash',
  poder: 'Velocidade',
  dataNascimento: '1998-01-01'
})

for (let i = 0; i <= 50; i++) {
  db.herois.insert({
    nome: `Clone ${i}`,
    poder: 'Velocidade',
    dataNascimento: '1998-01-01'
  })
}

db.herois.count()
db.herois.findOne()
db.herois.limit(1000).sort({ nome: -1 }) // limita a mil registros// nomes ordenados do menos para o maior
db.herois.find({}, { poder: 1, _id: 0 }) // seleciona apenas a coluna poder, e oculta o id

// Create
db.herois.insert({
  nome: 'Flash',
  poder: 'Velocidade',
  dataNascimento: '1998-01-01'
})

// Read
db.herois.find()

// Update
db.herois.update({_id: ObjectId("5d487cda92ede7aa4bf21ce2")}, {nome: 'Mauro'})
// isso acima, ao retornar some o restante do json, fica apenas o nome e o id. poder some
// Pra que isso nao ocorra...
db.herois.update({_id: ObjectId("5d48847f92ede7aa4bf21cf5")},
                 {$set: {nome: "Lanterna verde"} })
                 //Caso se confunda e coloque name ao invés de nome, ele adicionará e nao trará nenhum aviso. Tomar cuidado nisso
// No update, ele atualiza o primeiro que ele encontra, caso queira atualizar todos que tenho um parametro em comum, nao tem como
// É uma segurança do mongo. Mas, caso queira fazer isso, tem que colocar uma flag informando isso. (que flag, ainda nao sei)
db.herois.update({poder: "Velocidade"},
                 {$set: {poder: "Super Força"} })


// Delete
// ele nao remove sem where. Por isso, necessita de uma query
db.herois.remove({}) //comando que remove tudo
db.herois.remove({nome: "Lanterna verde"}) // deleta alguem especifico