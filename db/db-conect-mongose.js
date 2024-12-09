const mongoose = require('mongoose');

const getConection = async () => {

    try {

        const url = 'mongodb+srv://danilovalderramaaa2:Dani;l0DBCl0@cluster0.41dbz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
        //'mongodb://localhost:27017'
        

        await mongoose.connect(url);
        console.log('conexión exitosa');

    } catch (error) {
        console.log(error);
        
    }
    
}

module.exports = {
    getConection
}

