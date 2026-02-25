// recorder.js - Audio recording with MediaRecorder API

export class AudioRecorder {
    constructor() {
        this.mediaRecorder = null;
        this.chunks = [];
        this.stream = null;
        this.isInitialized = false;
    }
    
    async init() {
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({ 
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                }
            });
            
            // Check supported MIME types
            const mimeType = this.getSupportedMimeType();
            
            this.mediaRecorder = new MediaRecorder(this.stream, { 
                mimeType,
                audioBitsPerSecond: 128000
            });
            
            this.chunks = [];
            
            this.mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    this.chunks.push(e.data);
                }
            };
            
            this.isInitialized = true;
            return true;
        } catch (error) {
            console.error('Failed to initialize recorder:', error);
            throw new Error('Não foi possível acessar o microfone. Verifique as permissões.');
        }
    }
    
    getSupportedMimeType() {
        const types = [
            'audio/webm;codecs=opus',
            'audio/webm',
            'audio/ogg;codecs=opus',
            'audio/mp4'
        ];
        
        for (const type of types) {
            if (MediaRecorder.isTypeSupported(type)) {
                return type;
            }
        }
        
        return ''; // Use default
    }
    
    start() {
        if (!this.isInitialized) {
            throw new Error('Recorder not initialized. Call init() first.');
        }
        
        this.chunks = [];
        this.mediaRecorder.start(100); // Collect data every 100ms
    }
    
    stop() {
        return new Promise((resolve, reject) => {
            if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') {
                reject(new Error('Recorder is not recording'));
                return;
            }
            
            this.mediaRecorder.onstop = () => {
                const mimeType = this.mediaRecorder.mimeType || 'audio/webm';
                const blob = new Blob(this.chunks, { type: mimeType });
                resolve(blob);
            };
            
            this.mediaRecorder.onerror = (e) => {
                reject(e);
            };
            
            this.mediaRecorder.stop();
        });
    }
    
    pause() {
        if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
            this.mediaRecorder.pause();
        }
    }
    
    resume() {
        if (this.mediaRecorder && this.mediaRecorder.state === 'paused') {
            this.mediaRecorder.resume();
        }
    }
    
    cleanup() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
        }
        this.mediaRecorder = null;
        this.chunks = [];
        this.stream = null;
        this.isInitialized = false;
    }
    
    getState() {
        return this.mediaRecorder ? this.mediaRecorder.state : 'inactive';
    }
}

// Helper function to create audio URL from blob
export function createAudioURL(blob) {
    return URL.createObjectURL(blob);
}

// Helper function to revoke audio URL
export function revokeAudioURL(url) {
    URL.revokeObjectURL(url);
}
