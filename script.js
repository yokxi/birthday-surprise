document.addEventListener('DOMContentLoaded', function() {

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

    scenaBusta.addEventListener('click', function() {
        cambiaScena(scenaBusta, scenaTorta);
        music.play();
        
        scenaTorta.style.cursor = 'pointer';
        scenaTorta.addEventListener('click', spegniCandeline);
        
        avviaAscoltoMicrofono();
    });
    
    btnNextFoto.addEventListener('click', function() {
        cambiaScena(scenaFoto, scenaFinale);
    });

    function avviaAscolnoMicrofono() {
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

        console.log("Volume: " + volumeMedio);

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

    setInterval(createConfetti, 150);

});