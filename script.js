// Menu Hamburguesa
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Cerrar menú al hacer clic en un enlace
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Smooth Scrolling para todos los enlaces
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Efecto de carga inicial
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Envío del formulario a WhatsApp
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Evita que el formulario se envíe por HTTP

    // Obtener valores del formulario
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const telefono = document.getElementById('telefono').value;
    const mensaje = document.getElementById('mensaje').value;

    // Número de teléfono del dueño (reemplaza con el número real)
    const numeroWhatsApp = "9581111017"; // Ejemplo: México: 52 + número (sin +)

    // Crear mensaje para WhatsApp
    let textoWhatsApp = `*Nuevo mensaje desde la web*%0A%0A`;
    textoWhatsApp += `*Nombre:* ${nombre}%0A`;
    textoWhatsApp += `*Email:* ${email}%0A`;
    if (telefono) textoWhatsApp += `*Teléfono:* ${telefono}%0A`;
    textoWhatsApp += `*Mensaje:* ${mensaje}`;

    // Abrir WhatsApp con el mensaje
    window.open(`https://wa.me/${numeroWhatsApp}?text=${textoWhatsApp}`, '_blank');

    // Opcional: Resetear el formulario
    this.reset();
});