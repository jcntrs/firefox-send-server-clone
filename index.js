const express = require('express');
const connectDB = require('./config/database');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 4000;

connectDB();

const optionsCors = {
    origin: process.env.FRONTEND_URL
}

app.use(cors(optionsCors));

// Habilitar la lectura de valores en body en formato json
app.use(express.json());

// Habilitar carpeta pública
app.use(express.static('uploads'));

app.use('/api/usuarios', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/enlaces', require('./routes/links'));
app.use('/api/archivos', require('./routes/files'));

app.listen(port, '0.0.0.0', () => {
    console.log(`El servidor esta funcionando en el puerto ${port}`);
});