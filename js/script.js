document.addEventListener('DOMContentLoaded', function() {
    const panels = document.querySelectorAll('.cyber-panel');
    const navLinks = document.querySelectorAll('.cyber-nav a');

    function checkScroll() {
        panels.forEach(panel => {
            const panelTop = panel.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            if (panelTop < windowHeight * 0.8) {
                panel.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', checkScroll);
    checkScroll(); // Controllo iniziale

    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const targetUrl = this.getAttribute('href');
            window.location.href = targetUrl;
        });
    });
});
