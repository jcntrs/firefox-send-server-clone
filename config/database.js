const mongoose = require('mongoose');
require('dotenv').config({ path: 'var.env' });

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_CONN_STR, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });
        console.log('Connected Database');
    } catch (error) {
        console.log('Hubo un error');
        console.log(error);
        process.exit(1);
    }
}

module.exports = connectDB;