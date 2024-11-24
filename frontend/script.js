// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        target.scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Accordion Effect for FAQ Section
const faqItems = document.querySelectorAll('.faq-item h3');

faqItems.forEach(faq => {
    faq.addEventListener('click', () => {
        // Toggle the 'active' class on the clicked FAQ item
        faq.classList.toggle('active');
        
        // Select the next sibling (the answer <p> tag) and toggle its visibility
        const answer = faq.nextElementSibling;
        if (faq.classList.contains('active')) {
            answer.style.maxHeight = answer.scrollHeight + 'px';
            answer.style.padding = '10px 0';
        } else {
            answer.style.maxHeight = 0;
            answer.style.padding = 0;
        }

        // Close other FAQ items
        faqItems.forEach(item => {
            if (item !== faq && item.classList.contains('active')) {
                item.classList.remove('active');
                item.nextElementSibling.style.maxHeight = 0;
                item.nextElementSibling.style.padding = 0;
            }
        });
    });
});
