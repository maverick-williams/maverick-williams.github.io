const formData = {
  image: '',
  location: '',
  phone: '',
  NFC: '',
}

let photoTaken = false;

const urlParams = new URLSearchParams(window.location.search);
formData.NFC = urlParams.get('nfc');

const width = 320; // We will scale the photo width to this
let height = 0; // This will be computed based on the input stream

let streaming = false;

const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const photo = document.getElementById("photo");
const startButton = document.getElementById("start-button");
const newPhotoButton = document.getElementById("newPhoto");
const loadingButton = document.getElementById('loading-button');
const locationButton = document.getElementById('locationButton');
const geoAgainButton = document.getElementById('geo-again');
const submitButton = document.getElementById('submitButton');

// fetch('../exampleImage.txt')
// .then(response => response.text())
// .then(data => {
//   photo.src = data;
//   photo.hidden = false;
// })


function geoFindMe() {
  const status = document.querySelector("#status");
  const mapLink = document.querySelector("#map-link");
  geoAgainButton.hidden = true;

  // mapLink.href = "";
  // mapLink.textContent = "";

  function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    status.textContent = "";
    mapLink.href = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
    mapLink.textContent = `Latitud: ${latitude} °, Longitud: ${longitude} °`;
    formData.location = `${latitude} ${longitude}`;
    loadingButton.hidden = true;
    geoAgainButton.hidden = false;
  }

  function error() {
    // status.textContent = "Unable to retrieve your location";
    mapLink.textContent = "No se pudo obtener la ubicación";
    loadingButton.hidden = true;
    locationButton.hidden = false;    
  }

  if (!navigator.geolocation) {
    status.textContent = "Geolocation is not supported by your browser";
  } else {
    // status.textContent = "Locating…";
    loadingButton.hidden = false;
    locationButton.hidden = true;
    navigator.geolocation.getCurrentPosition(success, error);
  }
}

function initStreaming() {
  try{
        navigator.mediaDevices
          // .getUserMedia({ video: true, audio: false })
          .getUserMedia({ video: { facingMode: { exact: "environment" } }, audio: false })
          .then((stream) => {
            video.srcObject = stream;
            video.play();
          })
          .catch((err) => {
            console.error(`An error occurred: ${err}`);
          });
    } catch (e) {
        alert(e);
    }
}

initStreaming();

video.addEventListener("canplay", (ev) => {
  if (!streaming) {
    streaming = true;
  }
});

startButton.addEventListener("click", (ev) => {
  takePicture();
  ev.preventDefault();
});

function clearPhoto() {
  const context = canvas.getContext("2d");
  context.fillStyle = "#aaaaaa";
  context.fillRect(0, 0, canvas.width, canvas.height);

  const data = canvas.toDataURL("image/png");
}

clearPhoto();

function takePicture() {
  try {
    const context = canvas.getContext("2d");
    const size = Math.min(video.videoWidth, video.videoHeight);
    canvas.width = size;
    canvas.height = size;
      // Calculamos el recorte centrado para mantener la proporción cuadrada
    const sx = (video.videoWidth - size) / 2;
    const sy = (video.videoHeight - size) / 2;
    context.drawImage(video, sx, sy, size, size, 0, 0, size, size);

    const data = canvas.toDataURL("image/png");
    formData.image = data;
    photo.src = data;
    photo.hidden = false;
    photoTaken = true;
    newPhotoButton.hidden = false;
    startButton.hidden = true;
  } catch(error) {
    alert(error)
  }
}

function resetPhoto() {
  photoTaken = false;
  photo.src = '';
  photo.hidden = true;
  formData.image = '';
  newPhotoButton.hidden = true;
  startButton.hidden = false;
}

// Create a single supabase client for interacting with your database
const supabase =  window.supabase.createClient('https://almrozbianjnzhdfqvyr.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsbXJvemJpYW5qbnpoZGZxdnlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2MDY2NDgsImV4cCI6MjA3ODE4MjY0OH0.KT5RZSUASTRIsIro7WADcWVNGH0thLmZj3wNADF16y4')

async function saveData() {
  submitButton.disabled = true;
  submitButton.textContent = 'Enviando...'
  const phone = document.getElementById('phone')
  formData.phone = `+569${phone.value}`;
  const { error } = await supabase
    .from('found')
    .insert(formData)
  
  console.log('ERROR:', error)
  if (error === null) {
    alert('Guardado con éxito')
  } else {
    alert(error)
  }
  submitButton.disabled = false;
  submitButton.textContent = 'Enviar'
}

document.getElementById("form").addEventListener("submit", function(e) {
  e.preventDefault(); // evita el envío automático
  saveData();
});