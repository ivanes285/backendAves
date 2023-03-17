const {connect, connection}= require("mongoose");
const MONGO_URI = process.env.MONGO_URI;

connect(MONGO_URI);
connection.once("open",() => {
    console.log("Database Connect")  //once escucha el evento de la primera y unica coneccion establecida
})

connection.on("error",(err) => {
    console.log("Database Error Conection", err); //on escucha el evento a cada momento de la bdd 
    process.exit();
})