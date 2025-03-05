const VIDEO_ELEMENT = document.getElementById('video');
//const IMGS_CONTAINER = document.getElementById('imgs-container');
const FILES_INPUT = document.getElementById('files-input');
const INTERVAL_INPUT = document.getElementById('interval');
const NUM_PHOTOS_INPUT = document.getElementById('numPhotos');
const PHOTO_BTN = document.getElementById('photo-btn');
const UPLOAD_BTN = document.getElementById('upload-btn');
const CLASES_CONTAINER = document.getElementById('clases-container');

//let isCapturing = false;
let capturedImgs = [];
let uploadedImgs = [];
let classNames = [];
let numPhotos = 0;
let contador = 0;
let parent = null;
let imgsContainer = null;

//Crea los 2 divs inciciales d clases
window.addEventListener('load', () => {
    //cutre
    createClass();
    createClass();
});

async function getAccessWebcam() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({
                audio: false,
                video: {
                    width: 500,
                    height: 375
                }
            })
            .then(function (stream) {
                VIDEO_ELEMENT.srcObject = stream;
            }).catch(function (error) {
                console.error('Se ha producido un error al acceder a la webcam. :(');
            });
    } else {
        console.error('Tu navegador no es compatible');
    }
}

function uploadFilesToPage(event, parent) {
        //Obtenemos el nombre d la clase introducido x el user
        let nameClass = parent.value;
        //let nameClass = document.getElementById('class-1').value;

        console.log('UploadFilesToPage PArent:',parent );
        console.log('UploadFilesToPage imgsContainer:',imgsContainer );


        //Obtenemos las imgs seleccionadas del user
        const files = event.target.files;
    
        //Iteramos sobre cada 1 d los archivos
        for (let file of files) {
            //creamos el lector d archivos
            const reader = new FileReader();
    
            //Una vez el lector tiene el archivo cargado
            reader.onload = (event) => {
                //Almacenamos la img en el array
                capturedImgs.push(event.target.result);
    
                //Creamos un elemento <img> para mostrarla
                const img = document.createElement('img');
                img.src = event.target.result;

                //La añadimos en la clase q corresponde
                imgsContainer.appendChild(img);
            };

            //Leemos el archivo como una url d datos en base64
            reader.readAsDataURL(file);
        }
}

async function uploadPhotos(nameClass) {
    //Enviamos los datos en un obj FormData (para + facilidad)
    const formData = new FormData();

    //Convierte cada img almacenada a un blob
    for (let i = 0; i < capturedImgs.length; i++) {
        //convertimos con blob en una img base64
        const blob = await (await fetch(capturedImgs[i])).blob();

        let nameImg = `${nameClass}${i}.png`;
        console.log(nameImg);

        //se agrega la img al formData con su nombre
        formData.append('images', blob, nameImg);
    }

    try {
        //se envian con una petición POST las imgs al server
        const response = await fetch('http://localhost:3000/imagenes', {
            method: 'POST',
            body: formData
        });

        //convierte la respuesta a json y la printeamos
        const result = await response.json();
        console.log('Imágenes subidas: ', result);

    } catch (err) {
        console.error('Error al subir las imágenes: ', err);
    }
}

function takeImgs() {
    let interval = INTERVAL_INPUT.valueAsNumber;
    let numPhotos = NUM_PHOTOS_INPUT.valueAsNumber;

    //Captura la img
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    canvas.width = 300;
    canvas.height = 300;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataURL = canvas.toDataURL('image/png');
    capturedImgs.push(dataURL); //añadimos a array d imgs capturadas 

    const img = document.createElement('img');
    img.src = dataURL;
    //añade la img al class-container d la clase q le corresponde
    imgsContainer.appendChild(img);
    contador++;

    if (numPhotos > contador) {
        setTimeout(takeImgs, interval);
    } else {
        //setTimeout(stopWebcam(), 2000);
        stopWebcam();
    }

}

function getClassName(parent) {
    console.log(parent);
    let inputClass = parent.childNodes[0];
    console.log(inputClass)

    return inputClass.value;
}

function createClass() {
    let classContainer = document.createElement('div');
    let inputClass = document.createElement('input');
    let inputFiles = document.createElement('input');
    let webcamBtn = document.createElement('button');
    let uploadBtn = document.createElement('button');
    let imgContainer = document.createElement('div');

    //config div contenedor
    classContainer.classList.add('class-container');

    //config del input d la clase
    inputClass.type = 'text';
    inputClass.required = true;
    inputClass.placeholder = 'Introduce el nombre de la clase';
    inputClass.classList.add('input-class');

    //config del input para subir archivos
    inputFiles.type = 'file';
    inputFiles.multiple = true;
    inputFiles.classList.add('files-input');
    inputFiles.addEventListener('change', (event) => {
        parent = inputFiles.parentElement;
        imgsContainer = parent.childNodes[3];
        uploadFilesToPage(event, parent);
    });

    //config del btn d la webcam
    webcamBtn.classList.add('btn');
    webcamBtn.textContent = 'Webcam';
    webcamBtn.classList.add('webcam-btn');
    webcamBtn.addEventListener('click', () => {
        getAccessWebcam();

        //**Pruebas random
        console.log(webcamBtn);
        let name = getClassName(webcamBtn.parentElement);
        console.log(name);
        parent = webcamBtn.parentElement;
        imgsContainer = webcamBtn.previousSibling;
    });

    //config div contenedor d las imgs q se suben / capturan
    imgContainer.classList.add('img-container');

    //config del btn para subir imgs
    uploadBtn.classList.add('btn');
    uploadBtn.textContent = 'Subir Fotos';
    uploadBtn.classList.add('upload-btn');
    uploadBtn.addEventListener('click', () => {
        let nameClass = inputClass.value;
        uploadPhotos(nameClass);
    });

    //se añaden los elementos al div contenedor
    classContainer.appendChild(inputClass);
    classContainer.appendChild(inputFiles);
    classContainer.appendChild(webcamBtn);
    classContainer.appendChild(imgContainer);
    classContainer.appendChild(uploadBtn);


    //y el div al container d clases
    CLASES_CONTAINER.appendChild(classContainer);

}

//permite parar el stream
function stopWebcam() {
    //obtiene el stream
    let stream = VIDEO_ELEMENT.srcObject;
    
    if(stream === null) return;

    //obtiene las pistas para ir parando 1 a 1
    tracks = stream.getTracks();
    tracks.forEach(function (track) {
        track.stop();
    });

    //se elimina/para tmb el stream del elemento video
    VIDEO_ELEMENT.srcObject = null;
}