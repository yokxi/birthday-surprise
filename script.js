document.addEventListener('DOMContentLoaded', function () {

    const scenaBusta = document.getElementById('scena-busta');
    const scenaTorta = document.getElementById('scena-torta');
    const scenaFoto = document.getElementById('scena-foto');
    const scenaFinale = document.getElementById('scena-finale');

    const btnNextFoto = document.getElementById('btn-next-foto');

    const micFallback = document.getElementById('mic-fallback');

    const music = document.getElementById('birthday-music');
    const confettiContainer = document.getElementById('confetti-container');
    const confettiColors = [
        '#E91E63', '#9C27B0', '#2196F3', '#4CAF50', '#FFEB3B', '#FF5722'
    ];

    let audioContext;
    let analyser;
    let micStream;
    let loopAnimazione;
    let candelaSpenta = false;

    function cambiaScena(scenaAttuale, nuovaScena) {
        scenaAttuale.classList.remove('active');
        nuovaScena.classList.add('active');
    }

    scenaBusta.addEventListener('click', function () {
        cambiaScena(scenaBusta, scenaTorta);
        music.play();

        // Restart CSS animations for the new cake
        // We do this by removing and re-adding the animation classes
        const animations = [
            'animate-drop-plate',
            'animate-drop-layer-1',
            'animate-drop-layer-2',
            'animate-drop-layer-3',
            'animate-drip'
        ];

        animations.forEach(animClass => {
            const elements = scenaTorta.querySelectorAll('.' + animClass);
            elements.forEach(el => {
                el.classList.remove(animClass);
                void el.offsetWidth; // Force reflow
                el.classList.add(animClass);
            });
        });

        // Handle flames separately if needed, or just let them flicker
        const flames = document.querySelectorAll('.new-flame');
        flames.forEach(f => {
            f.style.opacity = '1';
            f.style.transform = 'scale(1)';
            f.classList.remove('animate-flame-ignite');
            void f.offsetWidth;
            f.classList.add('animate-flame-ignite');
        });

        setTimeout(() => {
            scenaTorta.style.cursor = 'pointer';
            scenaTorta.addEventListener('click', spegniCandeline);
            avviaAscoltoMicrofono();
        }, 2500);
    });

    btnNextFoto.addEventListener('click', function () {
        cambiaScena(scenaFoto, scenaFinale);
    });

    function avviaAscoltoMicrofono() {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(gestisciStream)
            .catch(gestisciErroreMic);
    }

    function gestisciStream(stream) {
        micStream = stream;
        audioContext = new AudioContext();
        analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaStreamSource(stream);

        source.connect(analyser);

        controllaSuono();
    }

    function controllaSuono() {
        if (candelaSpenta) return;

        const SOGLIA_RUMORE = 160;

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        analyser.getByteTimeDomainData(dataArray);

        let somma = 0;
        for (let i = 0; i < dataArray.length; i++) {
            somma += Math.abs(dataArray[i] - 128);
        }
        let volumeMedio = somma / dataArray.length;

        if (volumeMedio > SOGLIA_RUMORE) {
            console.log("SOFFIO RILEVATO!");
            spegniCandeline();
        } else {
            loopAnimazione = requestAnimationFrame(controllaSuono);
        }
    }

    function spegniCandeline() {
        if (candelaSpenta) return;
        candelaSpenta = true;

        if (loopAnimazione) {
            cancelAnimationFrame(loopAnimazione);
        }

        // Extinguish new flames
        document.querySelectorAll('.new-flame').forEach(fiamma => {
            fiamma.style.transition = 'opacity 0.5s, transform 0.5s';
            fiamma.style.opacity = '0';
            fiamma.style.transform = 'scale(0)';
        });

        if (micStream) {
            micStream.getTracks().forEach(track => track.stop());
        }
        if (audioContext) {
            audioContext.close();
        }

        setTimeout(() => {
            cambiaScena(scenaTorta, scenaFoto);
        }, 1500);
    }

    function gestisciErroreMic(errore) {
        console.error("Errore microfono:", errore);
        micFallback.style.display = 'block';
    }

    function createConfetti() {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');

        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.backgroundColor = confettiColors[Math.floor(Math.random() * confettiColors.length)];
        confetti.style.animationDuration = (Math.random() * 3 + 4) + 's';
        confetti.style.animationDelay = Math.random() * 2 + 's';

        confetti.addEventListener('animationend', () => {
            confetti.remove();
        });

        confettiContainer.appendChild(confetti);
    }

    const animals = ['🦋', '🐰', '🐱', '🐦', '🐞', '🦄', '🐼'];

    function createAnimal() {
        const animal = document.createElement('div');
        animal.classList.add('animaletto');
        animal.textContent = animals[Math.floor(Math.random() * animals.length)];

        animal.style.left = Math.random() * 100 + 'vw';
        // Randomize size slightly
        animal.style.fontSize = (Math.random() * 1.5 + 1.5) + 'rem';

        // Randomize animation duration
        const duration = Math.random() * 10 + 15; // 15-25s (slow floating)
        animal.style.animationDuration = duration + 's';

        animal.addEventListener('animationend', () => {
            animal.remove();
        });

        document.body.appendChild(animal);
    }

    setInterval(createConfetti, 150);
    setInterval(createAnimal, 2000); // Spawn an animal every 2 seconds

});