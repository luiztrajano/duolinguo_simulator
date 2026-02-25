// timer.js - Countdown timer com correção de drift

export class CountdownTimer {
    constructor(durationMs, onTick, onComplete) {
        this.duration = durationMs;
        this.onTick = onTick;
        this.onComplete = onComplete;
        this.startTime = null;
        this.elapsed = 0;
        this.running = false;
        this.rafId = null;
    }
    
    start() {
        if (this.running) return;
        this.startTime = performance.now();
        this.running = true;
        this._tick();
    }
    
    _tick() {
        if (!this.running) return;
        
        const now = performance.now();
        const elapsed = this.elapsed + (now - this.startTime);
        const remaining = Math.max(0, this.duration - elapsed);
        
        // Call onTick with remaining time
        if (this.onTick) {
            this.onTick(remaining);
        }
        
        // Check if time is up
        if (remaining <= 0) {
            this.running = false;
            if (this.onComplete) {
                this.onComplete();
            }
            return;
        }
        
        // Schedule next tick
        this.rafId = requestAnimationFrame(() => this._tick());
    }
    
    pause() {
        if (!this.running) return;
        this.running = false;
        this.elapsed += performance.now() - this.startTime;
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
        }
    }
    
    resume() {
        if (this.running) return;
        this.startTime = performance.now();
        this.running = true;
        this._tick();
    }
    
    stop() {
        this.running = false;
        this.elapsed = 0;
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
        }
    }
    
    reset(newDuration) {
        this.stop();
        if (newDuration !== undefined) {
            this.duration = newDuration;
        }
        this.elapsed = 0;
    }
    
    getRemaining() {
        if (!this.running) {
            return Math.max(0, this.duration - this.elapsed);
        }
        const elapsed = this.elapsed + (performance.now() - this.startTime);
        return Math.max(0, this.duration - elapsed);
    }
}

// Helper function to format time
export function formatTime(ms) {
    const totalSeconds = Math.ceil(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
