document.addEventListener('DOMContentLoaded', () => {
    const messageInput = document.getElementById('messageInput');
    const charCount = document.querySelector('.char-count');
    const clearBtn = document.getElementById('clearBtn');
    const scanBtn = document.getElementById('scanBtn');
    const exBtns = document.querySelectorAll('.ex-btn');
    
    const scanOverlay = document.getElementById('scanOverlay');
    const scanStatusText = document.getElementById('scanStatus');
    const resultSection = document.getElementById('resultSection');
    const verdictCard = document.getElementById('verdictCard');
    
    // UI Helpers
    messageInput.addEventListener('input', () => {
        charCount.textContent = `${messageInput.value.length} characters`;
    });

    clearBtn.addEventListener('click', () => {
        messageInput.value = '';
        charCount.textContent = '0 characters';
        resultSection.classList.add('hidden');
        scanOverlay.classList.add('hidden');
    });

    exBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const text = btn.textContent.replace(/^"|"$/g, '');
            messageInput.value = text;
            charCount.textContent = `${text.length} characters`;
        });
    });

    // Scan Logic
    scanBtn.addEventListener('click', async () => {
        const text = messageInput.value.trim();
        if (!text) {
            alert('Please enter an SMS message to scan.');
            return;
        }

        // 1. Hide results, show scan overlay
        resultSection.classList.add('hidden');
        scanOverlay.classList.remove('hidden');
        
        // 2. Animation sequence
        scanStatusText.textContent = 'ANALYZING MESSAGE...';
        await delay(600);
        scanStatusText.textContent = 'RUNNING TF-IDF ANALYSIS...';
        await delay(600);
        scanStatusText.textContent = 'CLASSIFYING WITH SVM...';
        await delay(600);

        // 3. API Fetch
        try {
            const response = await fetch('/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text })
            });
            const data = await response.json();

            scanOverlay.classList.add('hidden');

            if (data.success) {
                renderResult(data);
            } else {
                alert(data.error);
            }
        } catch (err) {
            scanOverlay.classList.add('hidden');
            alert('Network error or server unreachable.');
        }
    });

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function renderResult(data) {
        resultSection.classList.remove('hidden');
        verdictCard.className = 'glass-panel verdict-card ' + (data.prediction === 'SPAM' ? 'spam' : 'safe');
        
        // Verdict HTML
        if (data.prediction === 'SPAM') {
            verdictCard.innerHTML = `
                <div class="v-icon">🚨</div>
                <div class="v-title">THREAT DETECTED</div>
                <p style="margin-bottom: 1rem;">SPAM MESSAGE</p>
                <div class="v-details">
                    <span>Classification: <strong>SPAM</strong></span>
                    <span>Threat Level: <strong>HIGH</strong></span>
                    <span>Engine: <strong>Linear SVM</strong></span>
                </div>
            `;
        } else {
            verdictCard.innerHTML = `
                <div class="v-icon">✓</div>
                <div class="v-title">MESSAGE CLEARED</div>
                <p style="margin-bottom: 1rem;">NOT SPAM</p>
                <div class="v-details">
                    <span>Classification: <strong>NOT SPAM</strong></span>
                    <span>Threat Level: <strong>LOW</strong></span>
                    <span>Engine: <strong>Linear SVM</strong></span>
                </div>
            `;
        }

        // Stats HTML
        const stats = data.message_stats;
        document.getElementById('heuristicsList').innerHTML = `
            <li>Characters: ${stats.characters}</li>
            <li>Words: ${stats.words}</li>
            <li>Digits: ${stats.digits}</li>
            <li>Uppercase Letters: ${stats.uppercase}</li>
            <li>Special Characters: ${stats.special_characters}</li>
            <li>Detected URLs: ${stats.urls}</li>
        `;

        document.getElementById('svmScore').textContent = data.decision_score;
    }

    // Scroll Spy for Navbar
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });
});