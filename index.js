import express from 'express'
import mongoose from 'mongoose'

const Animal = mongoose.model('Animal', new mongoose.Schema({
    type: String,
    name: String
}))

const app = express();

//mongoose.connect('mongodb://jsalvar124:docker-password@localhost:27017/docker-animals?authSource=admin') //Está en la maquina local, pero como lo vamos a empaquetar en un contenedor, pues para la conexión en lugar de localhost, se usa el alias del contenedor de la bd
mongoose.connect('mongodb://jsalvar124:docker-password@monguito:27017/docker-animals?authSource=admin') //para permitir que se pueda conectar se cambia localhost por monguito
app.get('/',async (_req,res)=>{
    console.log('listando...Alcachofa')
    const animales = await Animal.find({}).maxTimeMS(30000);
    return(res.send({
        status: 200,
        data: animales}))
})

app.get('/create',async (_req,res)=>{
    console.log('creando...Gatos...')
    const animal = await Animal.create({type: 'gato', name: 'Pistacho Azul'})
    return(res.send({
        status: 201,
        message: 'Animal creado',
        data: animal }))
})

app.listen(3000, ()=> console.log('Running on port 3000'))

//mongodb+srv://jsalvar124:docker-password@docker-animals.q3xdiqr.mongodb.net/?retryWrites=true&w=majority&appName=docker-animals

//      MONGO_INITDB_ROOT_USERNAME: root
//      MONGO_INITDB_ROOT_PASSWORD: example

// docker create -p27017:27017 --name monguito --network mongo-node -e MONGO_INITDB_ROOT_USERNAME=jsalvar124 -e MONGO_INITDB_ROOT_PASSWORD=docker-password mongo
// docker compose up 