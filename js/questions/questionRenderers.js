// questionRenderers.js - Renders different question types

export function renderReadAndSelect(question, container) {
    container.innerHTML = `
        <div class="question-type">Read and Select</div>
        <h2 class="question-title">Is this a real English word?</h2>
        <div class="question-text" style="font-size: 48px; text-align: center; font-weight: 700; margin: 60px 0;">
            ${question.word}
        </div>
        <div class="word-choice-grid">
            <button class="word-option" data-answer="true">
                <div style="font-size: 24px; margin-bottom: 8px;">✓</div>
                <div>REAL WORD</div>
            </button>
            <button class="word-option" data-answer="false">
                <div style="font-size: 24px; margin-bottom: 8px;">✗</div>
                <div>NOT A WORD</div>
            </button>
        </div>
    `;
    
    const options = container.querySelectorAll('.word-option');
    let selectedAnswer = null;
    
    options.forEach(option => {
        option.addEventListener('click', () => {
            options.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            selectedAnswer = option.dataset.answer === 'true';
        });
    });
    
    return {
        getAnswer: () => selectedAnswer,
        isValid: () => selectedAnswer !== null
    };
}

export function renderFillBlanks(question, container) {
    const blanks = question.sentence.split('_____');
    let html = '<div class="question-type">Fill in the Blanks</div>';
    html += '<h2 class="question-title">Complete the sentence</h2>';
    html += '<div class="question-text" style="font-size: 22px; line-height: 2;">';
    
    blanks.forEach((part, index) => {
        html += part;
        if (index < blanks.length - 1) {
            html += `<input type="text" class="text-input blank-input" data-index="${index}" 
                     style="display: inline-block; width: 150px; margin: 0 8px; text-align: center;" />`;
        }
    });
    
    html += '</div>';
    container.innerHTML = html;
    
    const inputs = container.querySelectorAll('.blank-input');
    
    return {
        getAnswer: () => Array.from(inputs).map(input => input.value.trim()),
        isValid: () => Array.from(inputs).every(input => input.value.trim())
    };
}

export function renderReadComplete(question, container) {
    const parts = question.passage.split(/([a-z]{1,4}__+)/);
    let blankIndex = 0;
    
    let html = '<div class="question-type">Read and Complete</div>';
    html += '<h2 class="question-title">Complete the missing parts</h2>';
    html += '<div class="question-text" style="font-size: 20px; line-height: 2.2;">';
    
    parts.forEach(part => {
        if (part.match(/[a-z]{1,4}__+/)) {
            const given = part.match(/([a-z]{1,4})__+/)[1];
            html += `<span style="background: #f3f4f6; padding: 2px;">${given}</span>`;
            html += `<input type="text" class="text-input ctest-input" data-index="${blankIndex}" 
                     style="display: inline; width: 80px; margin: 0 2px; border: none; border-bottom: 2px solid #58CC02; text-align: center; background: #f3f4f6;" />`;
            blankIndex++;
        } else {
            html += part;
        }
    });
    
    html += '</div>';
    html += `<div style="margin-top: 20px; color: #6B7280; font-size: 14px;">
        <strong>Dica:</strong> Complete cada parte faltante. As letras já fornecidas estão corretas.
    </div>`;
    
    container.innerHTML = html;
    
    const inputs = container.querySelectorAll('.ctest-input');
    
    return {
        getAnswer: () => Array.from(inputs).map(input => input.value.trim()),
        isValid: () => Array.from(inputs).every(input => input.value.trim())
    };
}

export function renderListenType(question, container) {
    let playsRemaining = question.maxReplays || 2;
    let audioElement = null;
    
    container.innerHTML = `
        <div class="question-type">Listen and Type</div>
        <h2 class="question-title">Type what you hear</h2>
        <div class="audio-player">
            <button class="play-button" id="play-audio-btn">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
            </button>
            <div class="audio-controls">
                <div class="plays-remaining">Reproduções restantes: <span id="plays-count">${playsRemaining}</span></div>
            </div>
        </div>
        <textarea class="textarea-input" placeholder="Digite aqui o que você ouviu..." id="listen-answer"></textarea>
    `;
    
    const playBtn = container.querySelector('#play-audio-btn');
    const playsCount = container.querySelector('#plays-count');
    const answerInput = container.querySelector('#listen-answer');
    
    // Create audio using speech synthesis for demo
    function speakText(text) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.9;
            utterance.pitch = 1;
            utterance.volume = 1;
            speechSynthesis.speak(utterance);
        }
    }
    
    playBtn.addEventListener('click', () => {
        if (playsRemaining > 0) {
            speakText(question.audioText || question.transcript);
            playsRemaining--;
            playsCount.textContent = playsRemaining;
            if (playsRemaining === 0) {
                playBtn.disabled = true;
                playBtn.style.opacity = '0.5';
            }
        }
    });
    
    return {
        getAnswer: () => answerInput.value.trim(),
        isValid: () => answerInput.value.trim().length > 0
    };
}

export function renderWritePhoto(question, container) {
    container.innerHTML = `
        <div class="question-type">Write About the Photo</div>
        <h2 class="question-title">Describe this image</h2>
        <div style="text-align: center; margin: 32px 0;">
            <div style="width: 100%; height: 300px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px;">
                📷 ${question.imageDescription}
            </div>
        </div>
        <textarea class="textarea-input" placeholder="Descreva o que você vê na imagem..." 
                  id="write-answer" style="min-height: 150px;"></textarea>
        <div class="word-count">
            Palavras: <span id="word-count">0</span> / ${question.minWords}
        </div>
    `;
    
    const textarea = container.querySelector('#write-answer');
    const wordCountSpan = container.querySelector('#word-count');
    
    textarea.addEventListener('input', () => {
        const words = textarea.value.trim().split(/\s+/).filter(Boolean);
        wordCountSpan.textContent = words.length;
    });
    
    return {
        getAnswer: () => textarea.value.trim(),
        isValid: () => {
            const words = textarea.value.trim().split(/\s+/).filter(Boolean);
            return words.length >= (question.minWords || 30);
        }
    };
}

export function renderSpeakPhoto(question, container) {
    let recorder = null;
    let audioBlob = null;
    let isRecording = false;
    let recordingStartTime = 0;
    let recordingDuration = 0;
    
    container.innerHTML = `
        <div class="question-type">Speak About the Photo</div>
        <h2 class="question-title">Describe this image aloud</h2>
        <div style="text-align: center; margin: 32px 0;">
            <div style="width: 100%; height: 300px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); 
                        border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px;">
                📷 ${question.imageDescription}
            </div>
        </div>
        <div class="recorder-controls">
            <button class="record-button" id="record-btn">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="5"></circle>
                </svg>
            </button>
            <div class="recording-timer" id="recording-timer">0:00</div>
            <div style="font-size: 14px; color: #6B7280;">
                <span id="record-status">Clique para iniciar a gravação</span>
            </div>
        </div>
        <div id="playback-area" style="display: none; text-align: center; margin-top: 20px;">
            <audio id="playback-audio" controls style="width: 100%;"></audio>
        </div>
    `;
    
    const recordBtn = container.querySelector('#record-btn');
    const timerDisplay = container.querySelector('#recording-timer');
    const statusText = container.querySelector('#record-status');
    const playbackArea = container.querySelector('#playback-area');
    const playbackAudio = container.querySelector('#playback-audio');
    
    // Import recorder dynamically
    import('../recorder.js').then(module => {
        recorder = new module.AudioRecorder();
    });
    
    let timerInterval;
    
    recordBtn.addEventListener('click', async () => {
        if (!isRecording) {
            try {
                if (!recorder || !recorder.isInitialized) {
                    await recorder.init();
                }
                recorder.start();
                isRecording = true;
                recordingStartTime = Date.now();
                recordBtn.classList.add('recording');
                statusText.textContent = 'Gravando... Clique novamente para parar';
                
                timerInterval = setInterval(() => {
                    const elapsed = Date.now() - recordingStartTime;
                    const seconds = Math.floor(elapsed / 1000);
                    const minutes = Math.floor(seconds / 60);
                    const secs = seconds % 60;
                    timerDisplay.textContent = `${minutes}:${secs.toString().padStart(2, '0')}`;
                }, 100);
            } catch (error) {
                alert('Erro ao acessar o microfone: ' + error.message);
            }
        } else {
            audioBlob = await recorder.stop();
            isRecording = false;
            recordingDuration = Date.now() - recordingStartTime;
            clearInterval(timerInterval);
            recordBtn.classList.remove('recording');
            statusText.textContent = 'Gravação completa! Você pode regravar se quiser.';
            
            // Show playback
            playbackArea.style.display = 'block';
            playbackAudio.src = URL.createObjectURL(audioBlob);
        }
    });
    
    return {
        getAnswer: () => ({ audioBlob, duration: recordingDuration }),
        isValid: () => audioBlob !== null,
        cleanup: () => {
            if (recorder) recorder.cleanup();
            clearInterval(timerInterval);
        }
    };
}

export function renderWritingSample(question, container) {
    container.innerHTML = `
        <div class="question-type">Writing Sample</div>
        <h2 class="question-title">${question.topic}</h2>
        <div style="margin-bottom: 24px; padding: 16px; background: #f3f4f6; border-radius: 8px; font-size: 14px; color: #6B7280;">
            <strong>Instruções:</strong> Escreva pelo menos ${question.minWords} palavras sobre este tópico. 
            Organize suas ideias e desenvolva seus argumentos de forma clara.
        </div>
        <textarea class="textarea-input" placeholder="Comece a escrever aqui..." 
                  id="writing-sample-answer" style="min-height: 300px;"></textarea>
        <div class="word-count">
            Palavras: <span id="word-count">0</span> / ${question.minWords}
        </div>
    `;
    
    const textarea = container.querySelector('#writing-sample-answer');
    const wordCountSpan = container.querySelector('#word-count');
    
    textarea.addEventListener('input', () => {
        const words = textarea.value.trim().split(/\s+/).filter(Boolean);
        wordCountSpan.textContent = words.length;
    });
    
    return {
        getAnswer: () => textarea.value.trim(),
        isValid: () => {
            const words = textarea.value.trim().split(/\s+/).filter(Boolean);
            return words.length >= (question.minWords || 130);
        }
    };
}
