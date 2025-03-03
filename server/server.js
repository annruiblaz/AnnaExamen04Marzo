const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());


app.use(express.static('/server/imagenes'));

//app.use('/imagenes', express.static(path.join(__dirname,'imagenes')));

console.log(path.join(__dirname,'imagenes'));

//config d almacenamiento d archivos con multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'imagenes/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '_' + file.originalname);
    }
});

const upload = multer({storage});

//Ruta para subir varias imgs 
                            // TODO: Retirar el 10 d num max
app.post('/imagenes', upload.array('images', 10), (req, res) => {
    //extraemos a un array solo el valor del name
    const files = req.files.map(file => file.filename);

    //devolvemos la respuesta d todo ok con el array d nombres d archivos subidos
    res.json({message: 'Imágenes subidas con éxito', files});
});

//inicia el server
app.listen(3000, () => console.log('Servidor activo en http://localhost:3000'));