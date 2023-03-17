const app = require('./server');


app.listen(app.get("PORT"),()=>{
console.log("Server Listen on Port", app.get("PORT"),   `http://localhost:${app.get("PORT")}/`);
});