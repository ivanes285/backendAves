const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const morgan = require('morgan');
const cookieParser= require('cookie-parser');
const path= require('path');


//SETTINGS
app.set("PORT", process.env.PORT || 4000)



//MIDLEWARES
app.use(morgan('dev'));
app.use(express.json())
app.use(cookieParser());
app.use(express.urlencoded({ extended:false }))
app.use('/images',express.static(path.join(__dirname, "/images")))  //Hcemos publica la carpeta imagenes

const corsOptions = {
    origin: '*',   //Reemplazar con el dominio
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions));



//Database
require('./database');



//Routes
app.use('/user',require('./Routes/user.routes'))
app.use('/api',require('./Routes/category.routes'))
app.use('/api',require('./Routes/place.routes'))
app.use('/api',require('./Routes/event.routes'))



const build = path.resolve(__dirname, '../build');
app.use(express.static(build));


app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../build/index.html'));
});



module.exports = app;










































