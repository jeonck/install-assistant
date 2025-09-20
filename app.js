document.addEventListener('DOMContentLoaded', () => {
    const guidesContainer = document.getElementById('guides-container');
    const searchInput = document.getElementById('search');
    const modal = document.getElementById('guide-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalSteps = document.getElementById('modal-steps');
    const closeButton = document.querySelector('.close-button');
    let guides = [];

    loadAllGuides();

    async function loadAllGuides() {
        try {
            const response = await fetch('data/guides.json');
            const fileList = await response.json();
            
            const promises = fileList.map(filename => 
                fetch(`data/${filename}`).then(res => res.json())
            );
            
            const guidesData = await Promise.all(promises);
            guides = guidesData;
            renderGuides(guides);
        } catch (error) {
            console.error('Error loading guides:', error);
        }
    }

    function renderGuides(guidesToRender) {
        guidesContainer.innerHTML = '';
        guidesToRender.forEach(guide => {
            const guideElement = document.createElement('div');
            guideElement.classList.add('guide');
            guideElement.innerHTML = `
                <h2>${guide.title}</h2>
                <p>${guide.description}</p>
            `;
            guideElement.addEventListener('click', () => openModal(guide));
            guidesContainer.appendChild(guideElement);
        });
    }

    function openModal(guide) {
        modalTitle.textContent = guide.title;
        modalSteps.innerHTML = '';
        guide.steps.forEach(step => {
            const stepElement = document.createElement('div');
            stepElement.classList.add('step');

            if (step.command) {
                stepElement.innerHTML = `
                    <p class="step-description">${step.description}</p>
                    <div class="step-command">
                        <pre><code>${step.command}</code></pre>
                        <button class="copy-button">Copy</button>
                    </div>
                `;
                const copyButton = stepElement.querySelector('.copy-button');
                copyButton.addEventListener('click', (e) => copyToClipboard(step.command, e.target));
            } else if (step.code) {
                stepElement.innerHTML = `
                    <p class="step-description">${step.description}</p>
                    <div class="step-code">
                        <pre><code>${step.code}</code></pre>
                        <button class="copy-button">Copy</button>
                    </div>
                `;
                const copyButton = stepElement.querySelector('.copy-button');
                copyButton.addEventListener('click', (e) => copyToClipboard(step.code, e.target));
            } else {
                stepElement.innerHTML = `<p class="step-description">${step.description}</p><p>${step.text}</p>`;
            }

            modalSteps.appendChild(stepElement);
        });
        modal.style.display = 'block';
    }

    function copyToClipboard(text, button) {
        navigator.clipboard.writeText(text).then(() => {
            button.textContent = 'Copied!';
            setTimeout(() => {
                button.textContent = 'Copy';
            }, 2000);
        }, () => {
            button.textContent = 'Failed!';
            setTimeout(() => {
                button.textContent = 'Copy';
            }, 2000);
        });
    }

    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });

    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredGuides = guides.filter(guide => {
            return guide.title.toLowerCase().includes(searchTerm) || guide.description.toLowerCase().includes(searchTerm);
        });
        renderGuides(filteredGuides);
    });
});