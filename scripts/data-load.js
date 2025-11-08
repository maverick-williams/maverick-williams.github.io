const image = document.getElementById('image');
const location2 = document.getElementById('location');
const phone = document.getElementById('phone');

// fetch('../exampleImage.txt')
// .then(res => res.text())
// .then(text => {
//     image.src = text;
// })
// .catch(e => console.error(e))


 document.getElementById("copyButton").addEventListener("click", () => {
    const texto = "¡Hola, mundo!";
    navigator.clipboard.writeText(texto)
      .then(() => {
        console.log("Texto copiado al portapapeles:", texto);
        alert("Texto copiado ✅");
      })
      .catch(err => {
        console.error("Error al copiar:", err);
      });
  });


const supabase =  window.supabase.createClient('https://almrozbianjnzhdfqvyr.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsbXJvemJpYW5qbnpoZGZxdnlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2MDY2NDgsImV4cCI6MjA3ODE4MjY0OH0.KT5RZSUASTRIsIro7WADcWVNGH0thLmZj3wNADF16y4')
supabase.from('found').select().then(response => displayData(response.data[0]))

function displayData(data) {
    image.src = data.image;
    location2.innerHTML = data.location;
    phone.innerHTML = data.phone;
}