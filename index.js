const express = require('express');
const connectDB = require('./config/database');
const app = express();

connectDB();

const port = process.env.PORT || 4000;

// Habilitar la lectura de valores en body
app.use(express.json());

app.use('/api/usuarios', require('./routes/users'));

app.listen(port, '0.0.0.0', () => {
    console.log(`El servidor esta funcionando en el puerto ${port}`);
});