const image = document.getElementById('image');
const location2 = document.getElementById('location');
const phone = document.getElementById('phone');

const nfcData = {
  image: '',
  location: '',
  phone: '',
}

// fetch('../exampleImage.txt')
// .then(res => res.text())
// .then(text => {
//     image.src = text;
// })
// .catch(e => console.error(e))


 document.getElementById("copyButton").addEventListener("click", () => {
    const texto = nfcData.phone;
    navigator.clipboard.writeText(texto)
      .then(() => {
        console.log("Texto copiado al portapapeles:", texto);
        alert("Numero de telefono copiado ✅");
      })
      .catch(err => {
        console.error("Error al copiar:", err);
      });
  });

document.getElementById("copyLocation").addEventListener("click", () => {
    const texto = nfcData.location;
    navigator.clipboard.writeText(texto)
      .then(() => {
        console.log("Texto copiado al portapapeles:", texto);
        alert("Ubicacion copiada ✅");
      })
      .catch(err => {
        console.error("Error al copiar:", err);
      });
  });

const urlParams = new URLSearchParams(window.location.search);
const nfc = urlParams.get('nfc');

const supabase =  window.supabase.createClient('https://almrozbianjnzhdfqvyr.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsbXJvemJpYW5qbnpoZGZxdnlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2MDY2NDgsImV4cCI6MjA3ODE4MjY0OH0.KT5RZSUASTRIsIro7WADcWVNGH0thLmZj3wNADF16y4')
supabase.from('found').select().order('created_at', { ascending: false }).eq('NFC', nfc)
.then(response => displayData(response.data[0]))

function displayData(data) {
  nfcData.image = data.image;
  nfcData.location = data.location;
  nfcData.phone = data.phone;
  image.src = data.image;
  const [latitude, longitude] = data.location.split(' ');
  location2.innerHTML = `Latitud: ${latitude}º, Longitud: ${longitude}º`;
  phone.innerHTML = data.phone;
}