const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.static('/server/uploads'));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({storage});

app.post('/upload', upload.array('images', 10), (req, res) => {
    const files = req.files.map(file => file.filename);
    res.json({message: 'Imágenes subidas con éxito', filename});
});

app.listen(3000, () => console.log('Servidor activo en http://localhost:3000'));