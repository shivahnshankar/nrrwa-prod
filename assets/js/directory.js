document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('dynamic-com-contacts-container');
    if (!container) return;

    const apiUrl = container.dataset.apiUrl;
    if (!apiUrl) {
        console.warn('Directory API URL not configured');
        return;
    }

    // Helper to create safe DOM elements
    function createContactCard(contact) {
        const card = document.createElement('div');
        card.style.padding = '1rem';
        card.style.background = 'var(--light-gray)';
        card.style.borderRadius = '8px';
        card.style.borderLeft = '3px solid var(--primary-blue)';

        const nameP = document.createElement('p');
        nameP.style.margin = '0 0 0.5rem 0';
        nameP.style.fontWeight = '600';
        nameP.style.color = 'var(--text-color)';
        nameP.textContent = contact.name;

        const phoneP = document.createElement('p');
        phoneP.style.margin = '0';

        const link = document.createElement('a');
        link.href = `tel:${contact.phone}`;
        link.style.color = 'var(--primary-blue)';
        link.style.textDecoration = 'none';
        link.style.fontSize = '1.1rem';
        link.textContent = `📞 ${contact.phone}`;

        phoneP.appendChild(link);

        if (contact.description) {
            const descP = document.createElement('p');
            descP.style.margin = '0.5rem 0 0 0';
            descP.style.fontSize = '0.9rem';
            descP.style.color = '#666';
            descP.textContent = contact.description;
            phoneP.appendChild(descP);
        }

        card.appendChild(nameP);
        card.appendChild(phoneP);
        return card;
    }

    // Helper to create a new accordion section
    function createNewSection(categoryName, contacts) {
        const item = document.createElement('div');
        item.className = 'donor-accordion-item';

        const header = document.createElement('div');
        header.className = 'donor-accordion-header';

        const h3 = document.createElement('h3');
        h3.style.margin = '0';
        h3.style.color = 'var(--primary-blue)';
        h3.textContent = categoryName;

        const toggle = document.createElement('span');
        toggle.className = 'donor-toggle';
        toggle.textContent = '▼';

        header.appendChild(h3);
        header.appendChild(toggle);

        const content = document.createElement('div');
        content.className = 'donor-accordion-content';

        const grid = document.createElement('div');
        grid.style.display = 'grid';
        grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(250px, 1fr))';
        grid.style.gap = '1rem';
        grid.style.padding = '1rem 0';

        contacts.forEach(contact => {
            grid.appendChild(createContactCard(contact));
        });

        content.appendChild(grid);
        item.appendChild(header);
        item.appendChild(content);

        // Add click listener (clone of existing accordion logic)
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            // Close all others? (Optional, matching existing behavior if any)
            // For now just toggle this one
            item.classList.toggle('active');
        });

        return item;
    }

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (!Array.isArray(data)) return;

            data.forEach(section => {
                // Check if this category already exists in the static list
                // We assume static headers have h3 text matching the category name
                const existingHeaders = Array.from(document.querySelectorAll('.donor-accordion-header h3'));
                let match = existingHeaders.find(h3 => h3.textContent.trim() === section.name.trim());

                if (match) {
                    // Match found! Append to existing grid
                    const accordionContent = match.parentElement.nextElementSibling;
                    const grid = accordionContent.querySelector('div'); // The grid container inside
                    if (grid) {
                        section.contacts.forEach(contact => {
                            grid.appendChild(createContactCard(contact));
                        });
                    }
                } else {
                    // No match, create new section with the (localized) name
                    const newSection = createNewSection(section.name, section.contacts);
                    container.appendChild(newSection);
                }
            });
        })
        .catch(err => console.error('Error fetching directory:', err));
});
