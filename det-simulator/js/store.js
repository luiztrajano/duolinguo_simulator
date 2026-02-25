// store.js - Estado centralizado com Pub/Sub pattern

export const store = {
    state: {
        // Test state
        currentSection: 0,
        currentQuestion: 0,
        totalQuestions: 0,
        answers: {},
        scores: {},
        
        // Timer
        timeRemaining: 0,
        timerRunning: false,
        
        // Mode
        isPracticeMode: true,
        
        // Recording
        isRecording: false,
        currentRecording: null,
        
        // History
        testHistory: [],
        
        // Current test questions
        questions: [],
        
        // Question bank
        questionBank: null
    },
    
    listeners: new Set(),
    
    setState(updater) {
        if (typeof updater === 'function') {
            updater(this.state);
        } else {
            Object.assign(this.state, updater);
        }
        this.notify();
    },
    
    notify() {
        this.listeners.forEach(listener => {
            try {
                listener(this.state);
            } catch (error) {
                console.error('Listener error:', error);
            }
        });
    },
    
    subscribe(listener) {
        this.listeners.add(listener);
        // Return unsubscribe function
        return () => this.listeners.delete(listener);
    },
    
    // Helper methods
    getCurrentQuestion() {
        return this.state.questions[this.state.currentQuestion];
    },
    
    saveAnswer(questionId, answer) {
        this.state.answers[questionId] = answer;
        this.notify();
    },
    
    nextQuestion() {
        if (this.state.currentQuestion < this.state.totalQuestions - 1) {
            this.setState(state => {
                state.currentQuestion++;
            });
            return true;
        }
        return false;
    },
    
    resetTest() {
        this.setState(state => {
            state.currentQuestion = 0;
            state.answers = {};
            state.scores = {};
            state.timeRemaining = 0;
            state.questions = [];
        });
    }
};
