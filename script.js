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

        // Animation for cake layers
        const strati = document.querySelectorAll('.strato');
        const candela = document.querySelector('.candela');

        // Reset animations
        strati.forEach(s => {
            s.classList.remove('falling');
            s.style.opacity = '0';
        });
        candela.classList.remove('show');

        // Trigger falling animation sequentially
        const strato1 = document.querySelector('.strato.strato-1');
        const strato2 = document.querySelector('.strato.strato-2');
        const strato3 = document.querySelector('.strato.strato-3');

        setTimeout(() => strato1.classList.add('falling'), 100);
        setTimeout(() => strato2.classList.add('falling'), 600);
        setTimeout(() => strato3.classList.add('falling'), 1100);

        // Show candle after layers
        setTimeout(() => {
            candela.classList.add('show');
            scenaTorta.style.cursor = 'pointer';
            scenaTorta.addEventListener('click', spegniCandeline);
            avviaAscoltoMicrofono();
        }, 1800);
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

        document.querySelectorAll('.fiamma').forEach(fiamma => {
            fiamma.style.display = 'none';
        });

        if (micStream) {
            micStream.getTracks().forEach(track => track.stop());
        }
        if (audioContext) {
            audioContext.close();
        }

        setTimeout(() => {
            cambiaScena(scenaTorta, scenaFoto);
        }, 1000);
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