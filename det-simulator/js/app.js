// app.js - Main application controller

import { store } from './store.js';
import { CountdownTimer, formatTime } from './timer.js';
import { LocalStorage } from './storage.js';
import { questionBank, generateFullTest } from './questions/questionBank.js';
import * as renderers from './questions/questionRenderers.js';
import * as grader from './grader.js';

class DETSimulator {
    constructor() {
        this.currentTimer = null;
        this.currentRenderer = null;
        
        // Initialize store with question bank
        store.setState({ questionBank });
        
        this.initializeUI();
        this.loadHistory();
    }
    
    initializeUI() {
        // Home screen buttons
        document.getElementById('start-full-test')?.addEventListener('click', () => {
            this.startTest(false); // Full test mode
        });
        
        document.getElementById('start-practice')?.addEventListener('click', () => {
            this.startTest(true); // Practice mode
        });
        
        document.getElementById('view-history')?.addEventListener('click', () => {
            this.showHistory();
        });
        
        // Test navigation
        document.getElementById('exit-test')?.addEventListener('click', () => {
            if (confirm('Tem certeza que deseja sair do teste? O progresso será perdido.')) {
                this.showScreen('home-screen');
                this.stopTimer();
            }
        });
        
        document.getElementById('next-btn')?.addEventListener('click', () => {
            this.handleNext();
        });
        
        // Feedback screen
        document.getElementById('continue-btn')?.addEventListener('click', () => {
            this.continueToNextQuestion();
        });
        
        // Results screen
        document.getElementById('new-test-btn')?.addEventListener('click', () => {
            this.startTest(true);
        });
        
        document.getElementById('back-home-btn')?.addEventListener('click', () => {
            this.showScreen('home-screen');
        });
        
        // History screen
        document.getElementById('back-from-history')?.addEventListener('click', () => {
            this.showScreen('home-screen');
        });
    }
    
    loadHistory() {
        const history = LocalStorage.getHistory();
        
        // Update stats on home screen
        const totalTests = history.length;
        const bestScore = history.length > 0 
            ? Math.max(...history.map(h => h.overallScore || 0))
            : '--';
        const avgScore = history.length > 0
            ? Math.round(history.reduce((sum, h) => sum + (h.overallScore || 0), 0) / history.length)
            : '--';
        
        document.getElementById('total-tests').textContent = totalTests;
        document.getElementById('best-score').textContent = bestScore;
        document.getElementById('avg-score').textContent = avgScore;
        
        store.setState({ testHistory: history });
    }
    
    startTest(practiceMode) {
        // Generate questions
        const questions = generateFullTest();
        
        store.setState({
            isPracticeMode: practiceMode,
            questions,
            totalQuestions: questions.length,
            currentQuestion: 0,
            answers: {},
            scores: {}
        });
        
        // Update UI
        const modeIndicator = document.getElementById('mode-indicator');
        if (modeIndicator) {
            modeIndicator.textContent = practiceMode ? 'Modo Prática' : 'Simulado Completo';
            modeIndicator.style.background = practiceMode ? '#1CB0F6' : '#58CC02';
        }
        
        this.showScreen('test-screen');
        this.renderCurrentQuestion();
    }
    
    renderCurrentQuestion() {
        const question = store.getCurrentQuestion();
        if (!question) {
            this.finishTest();
            return;
        }
        
        const container = document.getElementById('question-container');
        
        // Update progress
        const current = store.state.currentQuestion + 1;
        const total = store.state.totalQuestions;
        document.getElementById('question-counter').textContent = `${current} / ${total}`;
        
        const progressPercent = (current / total) * 100;
        document.getElementById('progress-fill').style.width = `${progressPercent}%`;
        
        // Render question based on type
        const rendererMap = {
            'read-select': renderers.renderReadAndSelect,
            'fill-blanks': renderers.renderFillBlanks,
            'read-complete': renderers.renderReadComplete,
            'listen-type': renderers.renderListenType,
            'write-photo': renderers.renderWritePhoto,
            'speak-photo': renderers.renderSpeakPhoto,
            'writing-sample': renderers.renderWritingSample
        };
        
        const renderer = rendererMap[question.type];
        if (renderer) {
            this.currentRenderer = renderer(question, container);
        } else {
            container.innerHTML = `
                <div class="question-type">${question.type}</div>
                <h2 class="question-title">Tipo de questão em desenvolvimento</h2>
                <p>Este tipo de questão ainda está sendo implementado.</p>
            `;
            this.currentRenderer = {
                getAnswer: () => null,
                isValid: () => false
            };
        }
        
        // Start timer if question has time limit
        this.startTimer(question.timeLimit);
    }
    
    startTimer(timeLimit) {
        this.stopTimer();
        
        if (!timeLimit) {
            document.getElementById('timer-display').style.display = 'none';
            return;
        }
        
        document.getElementById('timer-display').style.display = 'flex';
        const timerText = document.getElementById('timer-text');
        const timerDisplay = document.getElementById('timer-display');
        
        this.currentTimer = new CountdownTimer(
            timeLimit,
            (remaining) => {
                timerText.textContent = formatTime(remaining);
                
                // Change color based on time remaining
                if (remaining <= 10000) {
                    timerDisplay.classList.add('danger');
                    timerDisplay.classList.remove('warning');
                } else if (remaining <= 30000) {
                    timerDisplay.classList.add('warning');
                    timerDisplay.classList.remove('danger');
                } else {
                    timerDisplay.classList.remove('warning', 'danger');
                }
            },
            () => {
                // Time's up - auto submit
                this.handleNext(true);
            }
        );
        
        this.currentTimer.start();
    }
    
    stopTimer() {
        if (this.currentTimer) {
            this.currentTimer.stop();
            this.currentTimer = null;
        }
    }
    
    handleNext(autoSubmit = false) {
        if (!this.currentRenderer) return;
        
        const answer = this.currentRenderer.getAnswer();
        const isValid = this.currentRenderer.isValid();
        
        if (!autoSubmit && !isValid) {
            alert('Por favor, responda a questão antes de continuar.');
            return;
        }
        
        this.stopTimer();
        
        const question = store.getCurrentQuestion();
        store.saveAnswer(question.id, answer);
        
        // Clean up renderer if needed
        if (this.currentRenderer.cleanup) {
            this.currentRenderer.cleanup();
        }
        
        // In practice mode, show feedback
        if (store.state.isPracticeMode) {
            this.showFeedback(question, answer);
        } else {
            // In full test mode, go directly to next question
            this.continueToNextQuestion();
        }
    }
    
    showFeedback(question, answer) {
        let result;
        
        // Grade based on question type
        switch (question.type) {
            case 'read-select':
                result = grader.gradeReadAndSelect(answer, question.isReal);
                break;
            case 'fill-blanks':
                result = grader.gradeFillBlanks(answer, [question.answer]);
                break;
            case 'read-complete':
                result = grader.gradeReadComplete(answer, question.blanks);
                break;
            case 'listen-type':
                result = grader.gradeListenAndType(answer, question.transcript);
                break;
            case 'write-photo':
            case 'writing-sample':
                result = grader.gradeWriting(answer, question);
                break;
            case 'speak-photo':
                result = grader.gradeSpeaking(answer.duration, question);
                break;
            default:
                result = { score: 0, feedback: 'Avaliação não disponível para este tipo de questão.' };
        }
        
        // Save score
        store.state.scores[question.id] = result.score;
        
        // Display feedback
        const feedbackIcon = document.getElementById('feedback-icon');
        const feedbackTitle = document.getElementById('feedback-title');
        const feedbackContent = document.getElementById('feedback-content');
        
        if (result.correct || result.score >= 80) {
            feedbackIcon.innerHTML = '<div style="font-size: 120px;">✅</div>';
            feedbackTitle.textContent = 'Correto!';
            feedbackTitle.style.color = '#58CC02';
        } else if (result.score >= 50) {
            feedbackIcon.innerHTML = '<div style="font-size: 120px;">⚠️</div>';
            feedbackTitle.textContent = 'Parcialmente Correto';
            feedbackTitle.style.color = '#FFC800';
        } else {
            feedbackIcon.innerHTML = '<div style="font-size: 120px;">❌</div>';
            feedbackTitle.textContent = 'Incorreto';
            feedbackTitle.style.color = '#FF4B4B';
        }
        
        // Build feedback content
        let feedbackHTML = `
            <div class="feedback-section">
                <div class="feedback-label">Pontuação</div>
                <div class="feedback-score">${result.score}/100</div>
            </div>
        `;
        
        if (result.feedback) {
            feedbackHTML += `
                <div class="feedback-section">
                    <div class="feedback-label">Feedback</div>
                    <div class="feedback-text">${result.feedback}</div>
                </div>
            `;
        }
        
        if (result.modelAnswer) {
            feedbackHTML += `
                <div class="feedback-section">
                    <div class="feedback-label">Resposta Modelo</div>
                    <div class="feedback-text" style="font-style: italic; color: #6B7280;">${result.modelAnswer}</div>
                </div>
            `;
        }
        
        feedbackContent.innerHTML = feedbackHTML;
        
        this.showScreen('feedback-screen');
    }
    
    continueToNextQuestion() {
        const hasNext = store.nextQuestion();
        
        if (hasNext) {
            this.showScreen('test-screen');
            this.renderCurrentQuestion();
        } else {
            this.finishTest();
        }
    }
    
    finishTest() {
        // Calculate scores
        const scores = store.state.scores;
        const scoreValues = Object.values(scores);
        const overallScore = scoreValues.length > 0
            ? Math.round(scoreValues.reduce((sum, score) => sum + score, 0) / scoreValues.length)
            : 0;
        
        // Convert to DET scale (10-160)
        const detScore = Math.round(10 + (overallScore / 100) * 150);
        
        // Calculate subscores (simplified - in real test these are calculated per subscore category)
        const readingScore = detScore;
        const writingScore = detScore;
        const listeningScore = detScore;
        const speakingScore = detScore;
        
        // Determine CEFR level
        let cefr = 'A1';
        if (detScore >= 125) cefr = 'C1';
        else if (detScore >= 105) cefr = 'B2';
        else if (detScore >= 85) cefr = 'B1';
        else if (detScore >= 60) cefr = 'A2';
        
        // Save to history
        const testResult = {
            overallScore: detScore,
            readingScore,
            writingScore,
            listeningScore,
            speakingScore,
            cefr,
            isPracticeMode: store.state.isPracticeMode,
            completedAt: Date.now()
        };
        
        LocalStorage.saveScore(testResult);
        this.loadHistory();
        
        // Display results
        document.getElementById('overall-score').textContent = detScore;
        document.getElementById('score-equivalent').textContent = `Nível CEFR: ${cefr}`;
        document.getElementById('reading-score').textContent = readingScore;
        document.getElementById('writing-score').textContent = writingScore;
        document.getElementById('listening-score').textContent = listeningScore;
        document.getElementById('speaking-score').textContent = speakingScore;
        
        this.showScreen('results-screen');
    }
    
    showHistory() {
        const historyList = document.getElementById('history-list');
        const history = store.state.testHistory;
        
        if (history.length === 0) {
            historyList.innerHTML = `
                <div style="text-align: center; padding: 60px 20px; color: #6B7280;">
                    <div style="font-size: 48px; margin-bottom: 16px;">📊</div>
                    <div style="font-size: 18px;">Nenhum teste completo ainda</div>
                    <div style="font-size: 14px; margin-top: 8px;">Complete um teste para ver seu histórico aqui</div>
                </div>
            `;
        } else {
            historyList.innerHTML = history
                .slice()
                .reverse()
                .map(test => {
                    const date = new Date(test.completedAt);
                    return `
                        <div class="history-item">
                            <div class="history-info">
                                <div class="history-date">${date.toLocaleDateString('pt-BR')} às ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</div>
                                <div class="history-mode">${test.isPracticeMode ? '📝 Modo Prática' : '🚀 Simulado Completo'}</div>
                            </div>
                            <div class="history-score">${test.overallScore}</div>
                        </div>
                    `;
                })
                .join('');
        }
        
        this.showScreen('history-screen');
    }
    
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        const screen = document.getElementById(screenId);
        if (screen) {
            screen.classList.add('active');
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new DETSimulator();
});
