// Galería interactiva
document.addEventListener('DOMContentLoaded', function() {
    // Menu Hamburguesa (si no está en script.js)
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if(hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }
    
    // Filtrado de imágenes
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Actualizar botón activo
            filterBtns.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            // Filtrar imágenes con animación
            galleryItems.forEach(item => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    if (filter === 'all' || item.getAttribute('data-category') === filter) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                    
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, 200);
            });
        });
    });
    
    // Modal para ampliar imágenes
    const modal = document.querySelector('.gallery-modal');
    const modalImg = document.getElementById('expandedImg');
    const captionText = document.querySelector('.modal-caption');
    const closeModal = document.querySelector('.close-modal');
    
    document.querySelectorAll('.gallery-overlay i').forEach(icon => {
        icon.addEventListener('click', function() {
            const galleryItem = this.closest('.gallery-item');
            const imgSrc = galleryItem.querySelector('img').src;
            const imgAlt = galleryItem.querySelector('img').alt;
            const imgTitle = galleryItem.querySelector('h3').textContent;
            const imgDesc = galleryItem.querySelector('p').textContent;
            
            modal.style.display = 'block';
            modalImg.src = imgSrc;
            modalImg.alt = imgAlt;
            captionText.innerHTML = `<strong>${imgTitle}</strong><br>${imgDesc}`;
            document.body.style.overflow = 'hidden'; // Deshabilitar scroll
        });
    });
    
    // Cerrar modal
    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Habilitar scroll
    });
    
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Cerrar con tecla ESC
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Efecto de carga para las imágenes
    const images = document.querySelectorAll('.gallery-item img');
    let loadedCount = 0;
    
    images.forEach(img => {
        if(img.complete) {
            imageLoaded();
        } else {
            img.addEventListener('load', imageLoaded);
        }
    });
    
    function imageLoaded() {
        loadedCount++;
        if(loadedCount === images.length) {
            document.querySelector('.gallery-container').style.opacity = '1';
        }
    }
});