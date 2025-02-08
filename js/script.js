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

document.addEventListener("DOMContentLoaded", function() {
    fetch('articles.json')
        .then(response => response.json())
        .then(data => {
            let searchInput = document.getElementById('search');
            let resultsContainer = document.getElementById('search-results');

            searchInput.addEventListener('input', function() {
                let query = searchInput.value.toLowerCase();
                resultsContainer.innerHTML = '';

                if (query.length < 2) return; // Evita ricerche troppo corte

                let results = data.filter(article =>
                    article.title.toLowerCase().includes(query) ||
                    article.description.toLowerCase().includes(query) ||
                    article.category.toLowerCase().includes(query)
                );

                results.forEach(article => {
                    let resultItem = document.createElement('div');
                    resultItem.classList.add('search-result');
                    resultItem.innerHTML = `
                        <a href="${article.url}">
                            <strong>${article.title}</strong> - ${article.date}
                        </a>
                        <p>${article.description}</p>
                    `;
                    resultsContainer.appendChild(resultItem);
                });

                if (results.length === 0) {
                    resultsContainer.innerHTML = '<p>Nessun risultato trovato.</p>';
                }
            });
        })
        .catch(error => console.error("Errore nel caricamento del JSON:", error));
});
