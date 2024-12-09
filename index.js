const express = require('express')
const {getConection} =require('./db/db-conect-mongose')

const cors =require('cors');

require('dotenv').config();


const app =express();
const port =process.env.PORT; 

//implementamos cors
app.use(cors());

getConection();



//parser JSON

app.use(express.json());

app.use('/login',require('./router/auth'));
app.use('/usuario',require('./router/user'));
app.use('/genero',require('./router/genero'));
app.use('/director',require('./router/director'));
app.use('/tipo',require('./router/tipo'));
app.use('/productora',require('./router/productora'));
app.use('/media',require('./router/media'));


app.listen(port,()=>{
    console.log(`Example app listening port ${port}`)
})
