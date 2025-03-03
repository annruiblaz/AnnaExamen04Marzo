const VIDEO_ELEMENT = document.getElementById('video');
const IMGS_CONTAINER = document.getElementById('imgs-container');
const FILES_INPUT = document.getElementById('files-input');
const INTERVAL_INPUT = document.getElementById('interval');
const PHOTO_BTN = document.getElementById('photo-btn');
const UPLOAD_BTN = document.getElementById('upload-btn');

let isCapturing = false;
let capturedImgs = [];
let uploadedImgs = [];
let classNames = [];

async function getAccessWebcam() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
/*         const stream = await navigator.mediaDevices.getUserMedia({video: true});
        VIDEO_ELEMENT.srcObject = stream; */
        navigator.mediaDevices.getUserMedia({
                audio: false,
                video: {
                    width: 500,
                    height: 375
                }
            })
            .then( function (stream) {
                VIDEO_ELEMENT.srcObject = stream;
            }).catch( function (error) {
                console.error('Se ha producido un error al acceder a la webcam. :(');
            });
    } else {
        console.error('Tu navegador no es compatible');
    }
}

function uploadImgs() {
    let nameClass = document.getElementById('class-1').textContent;
    console.log(nameClass);
}

PHOTO_BTN.addEventListener('mousedown', () => {
    isCapturing = true;
    takePhotos();
});

PHOTO_BTN.addEventListener('mouseup', () => {
    isCapturing = false;
});

function takePhotos() {
    if(!isCapturing) return;
    
    let interval = INTERVAL_INPUT.value + '000';
    console.log(parseInt(interval));

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    canvas.width = 300;
    canvas.height = 300;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataURL = canvas.toDataURL('image/png');
    capturedImgs.push(dataURL);

    //Mostramos las imgs capturadas en el html
    const img = document.createElement('img');
    img.src = dataURL;
    IMGS_CONTAINER.appendChild(img);

    setTimeout(takePhotos, parseInt(interval));

}

