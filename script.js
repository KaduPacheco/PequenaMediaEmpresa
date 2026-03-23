document.addEventListener('DOMContentLoaded', () => {
    // Select all elements that should be animated on scroll
    const animatedElements = document.querySelectorAll('.reset-anim');

    // Create an Intersection Observer
    const observerOptions = {
        root: null, // Viewport
        rootMargin: '0px 0px -50px 0px', // Trigger slightly before the element comes into view
        threshold: 0.15 // Trigger when 15% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add the visible class to trigger the animation
                entry.target.classList.add('visible');
                // Optional: Stop observing once the animation has triggered
                // observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    // Observe each element
    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // Form submission logic
    const leadForm = document.getElementById('leadForm');
    if (leadForm) {
        leadForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = leadForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Enviando...';

            const formData = {
                empresa: document.getElementById('empresa').value,
                colaboradores: document.getElementById('colaboradores').value,
                nome: document.getElementById('responsavel').value,
                telefone: document.getElementById('whatsapp').value,
                email: document.getElementById('email').value
            };

            try {
                const response = await fetch('http://localhost:3002/leads', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();

                if (response.ok) {
                    alert('Solicitação enviada com sucesso! Entraremos em contato em breve.');
                    leadForm.reset();
                } else {
                    alert('Erro ao enviar: ' + (result.error || 'Erro desconhecido'));
                }
            } catch (error) {
                console.error('Erro na requisição:', error);
                alert('Erro ao conectar com o servidor. Verifique se o backend está rodando.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        });
    }
});
