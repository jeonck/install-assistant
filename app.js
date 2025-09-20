document.addEventListener('DOMContentLoaded', () => {
    const guidesContainer = document.getElementById('guides-container');
    const searchInput = document.getElementById('search');
    const modal = document.getElementById('guide-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalSteps = document.getElementById('modal-steps');
    const closeButton = document.querySelector('.close-button');
    let guides = [];

    Promise.all([
        fetch('data/Docker_on_Ubuntu.json').then(res => res.json()),
        fetch('data/containerd_on_RHEL_8.10.json').then(res => res.json()),
        fetch('data/OpenSearch_on_Helm.json').then(res => res.json()),
        fetch('data/ArgoCD_Installation.json').then(res => res.json()),
        fetch('data/Calico_on_OnPrem_K8s_Installation.json').then(res => res.json()),
        fetch('data/MetalLB_Installation.json').then(res => res.json()),
        fetch('data/MinIO_Installation.json').then(res => res.json()),
        fetch('data/Kafka_AirGapped_Helm_Installation.json').then(res => res.json()),
        fetch('data/MinIO_K8s_Installation.json').then(res => res.json()),
        fetch('data/Apache_Flink_Installation.json').then(res => res.json()),

        fetch('data/Nginx_AirGapped_Helm_Installation.json').then(res => res.json()),
        fetch('data/Pinot_on_K8s_Installation.json').then(res => res.json()),
        fetch('data/Airflow_on_K8s_Installation.json').then(res => res.json()),
        fetch('data/Helm_Usage_Guide.json').then(res => res.json()),
        fetch('data/Ingress_Service_Provisioning.json').then(res => res.json()),
        fetch('data/OpenSearch_Utilization_Manual.json').then(res => res.json()),
        fetch('data/KVM_K8s_Installation.json').then(res => res.json()),
        fetch('data/MySQL_on_K8s_Installation.json').then(res => res.json()),
        fetch('data/Oracle_on_K8s_Installation.json').then(res => res.json())
    ])
        .then(data => {
            guides = data;
            renderGuides(guides);
        })
        .catch(error => console.error('Error fetching or parsing data:', error));

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