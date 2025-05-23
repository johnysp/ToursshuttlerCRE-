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
    e.preventDefault();

    // Obtener valores del formulario
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const telefono = document.getElementById('telefono').value;
    const mensaje = document.getElementById('mensaje').value;

    // Número de teléfono del dueño
    const numeroWhatsApp = "9581111017";

    // Crear mensaje para WhatsApp
    let textoWhatsApp = `*Nuevo mensaje desde la web*%0A%0A`;
    textoWhatsApp += `*Nombre:* ${nombre}%0A`;
    textoWhatsApp += `*Email:* ${email}%0A`;
    if (telefono) textoWhatsApp += `*Teléfono:* ${telefono}%0A`;
    textoWhatsApp += `*Mensaje:* ${mensaje}`;

    // Abrir WhatsApp con el mensaje
    window.open(`https://wa.me/${numeroWhatsApp}?text=${textoWhatsApp}`, '_blank');

    // Resetear el formulario
    this.reset();
});

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAKRTdVrQxaLUCui5i5zmysgK7HTnieKsM",
    authDomain: "comentarios-8336c.firebaseapp.com",
    projectId: "comentarios-8336c",
    storageBucket: "comentarios-8336c.appspot.com",
    messagingSenderId: "837687714909",
    appId: "1:837687714909:web:017303635bf2e03be7d9b4",
    measurementId: "G-P22JRZ1LYB"
};

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Sistema de valoración con estrellas
document.querySelectorAll('.estrellas i').forEach(star => {
    star.addEventListener('click', function() {
        const rating = parseInt(this.getAttribute('data-rating'));
        const starsContainer = this.parentElement;
        const stars = starsContainer.querySelectorAll('i');
        
        stars.forEach((s, index) => {
            if (index < rating) {
                s.classList.replace('far', 'fas');
            } else {
                s.classList.replace('fas', 'far');
            }
        });
    });
});

function resetStars() {
    document.querySelectorAll('.estrellas i').forEach(star => {
        star.classList.replace('fas', 'far');
    });
}

// Sistema de Comentarios con Firebase
document.getElementById('formComentario').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    
    try {
        // Mostrar estado de carga
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';
        
        // Obtener valores del formulario
        const nombre = document.getElementById('nombreUsuario').value.trim();
        const texto = document.getElementById('textoComentario').value.trim();
        const rating = document.querySelector('.estrellas .fas')?.parentElement.querySelectorAll('.fas').length || 0;
        const fecha = new Date().toLocaleDateString('es-ES');

        // Validación
        if (!nombre || !texto) {
            alert('Por favor completa todos los campos requeridos');
            return;
        }

        if (rating === 0) {
            alert('Por favor selecciona una calificación');
            return;
        }

        // Guardar en Firestore
        await db.collection("comentarios").add({
            nombre,
            texto,
            rating,
            fecha,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        // Resetear formulario
        this.reset();
        resetStars();
        
        // Recargar comentarios
        await cargarComentarios();
        
        // Mostrar confirmación
        alert('¡Gracias por tu comentario!');
    } catch (error) {
        console.error("Error al guardar:", error);
        alert('Hubo un error al guardar tu comentario. Por favor intenta nuevamente.');
    } finally {
        // Restaurar botón
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
    }
});

// Función para cargar comentarios
async function cargarComentarios() {
    const listaComentarios = document.getElementById('listaComentarios');
    
    try {
        // Mostrar indicador de carga
        listaComentarios.innerHTML = '<div class="loading">Cargando comentarios...</div>';
        
        const querySnapshot = await db.collection("comentarios")
            .orderBy("timestamp", "desc")
            .get();
            
        // Limpiar lista
        listaComentarios.innerHTML = '';
        
        if (querySnapshot.empty) {
            listaComentarios.innerHTML = '<div class="no-comments">No hay comentarios aún. ¡Sé el primero en comentar!</div>';
            return;
        }
        
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const comentarioHTML = `
                <div class="comentario">
                    <div class="comentario-header">
                        <h4>${data.nombre}</h4>
                        <div class="estrellas">
                            ${'<i class="fas fa-star"></i>'.repeat(data.rating) + '<i class="far fa-star"></i>'.repeat(5 - data.rating)}
                        </div>
                    </div>
                    <p>"${data.texto}"</p>
                    <small>Publicado el ${data.fecha}</small>
                </div>
            `;
            listaComentarios.insertAdjacentHTML('beforeend', comentarioHTML);
        });
    } catch (error) {
        console.error("Error al cargar comentarios:", error);
        listaComentarios.innerHTML = '<div class="error">Error al cargar los comentarios. Por favor recarga la página.</div>';
    }
}

// Cargar comentarios al iniciar
document.addEventListener('DOMContentLoaded', cargarComentarios);