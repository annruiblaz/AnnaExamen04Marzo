const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs-extra');
const { dir } = require('console');

const app = express();
app.use(cors());

const base_URL = path.join(__dirname,'imagenes');
app.use('/server/imagenes', express.static(base_URL));
console.log('Ruta dirName + imgs', base_URL);


//config d almacenamiento d archivos con multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log('Clase?', req.query.class);
        const dir = path.join(base_URL, req.query.class);
        console.log('Dir: ', dir);
        fs.ensureDirSync(dir);
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '_' + file.originalname);
    }
});

const upload = multer({storage});

//Ruta para subir varias imgs 
app.post('/imagenes', upload.array('images'), (req, res) => {
    //devolvemos la respuesta d todo ok con el array d nombres d archivos subidos
    return res.json({message: 'Imágenes subidas con éxito', req});
});

app.get('/ver-imagenes', async (req, res) => {
    const className = req.query.class;

    if(!fs.existsSync(base_URL)) {
        return res.status(404).send('No existe la carpeta de imágenes.  :(');
    }

    const subdirs = await fs.readdir(base_URL);
    console.log('Subdirectorios en la carpeta imágenes: ', subdirs);

    let html = `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8">
            <title>Resultados de la carpeta imágenes</title>
            <style>
                img { margin: 10px; max-width: 200px; max-height: 200px; }
            </style>
        </head>
        <body>
            <h2>Resultados de la carpeta imágenes:</h2>
    `;

    //Leemos el contenido d la subcarpeta
    for(const subdir of subdirs) {
        const dirUrl = path.join(base_URL, subdir);
        const imgs = await fs.readdir(dirUrl);
        console.log(`Imágenes en la subcarpeta ${subdir}: `, imgs);
        html += `<h4>Directorio: ${subdir}</h4>`;
        console.log('baseURl: ', base_URL);

        //iteramos sobre cada img y la pintamos en el html
        for(const img of imgs) {
            html += `<img src="/server/imagenes/${subdir}/${img}" alt="${img}" /> <br/>`;
        }
    }

    //cerramos y envia el html como respuesta
    html += `</body></html>`;
    res.send(html);
});

//inicia el server
app.listen(3000, () => console.log('Servidor activo en http://localhost:3000'));