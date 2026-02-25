// grader.js - Auto-grading logic for different question types

// Levenshtein Distance algorithm
function levenshteinDistance(a, b) {
    if (!a || !b) return Math.max(a?.length || 0, b?.length || 0);
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;
    
    // Ensure a is the shorter string
    if (a.length > b.length) {
        [a, b] = [b, a];
    }
    
    let row = Array.from({ length: a.length + 1 }, (_, i) => i);
    
    for (let i = 1; i <= b.length; i++) {
        let prev = i;
        for (let j = 1; j <= a.length; j++) {
            const val = b[i - 1] === a[j - 1]
                ? row[j - 1]
                : Math.min(row[j - 1] + 1, prev + 1, row[j] + 1);
            row[j - 1] = prev;
            prev = val;
        }
        row[a.length] = prev;
    }
    
    return row[a.length];
}

// Normalize text for comparison
function normalizeText(text) {
    return text
        .trim()
        .toLowerCase()
        .replace(/[^\w\s'-]/g, '')
        .replace(/\s+/g, ' ');
}

// Grade Read and Select (exact match)
export function gradeReadAndSelect(userAnswer, correctAnswer) {
    const correct = userAnswer === correctAnswer;
    return {
        score: correct ? 100 : 0,
        correct,
        feedback: correct 
            ? '✓ Correto!' 
            : `✗ A resposta correta é: ${correctAnswer ? 'Palavra REAL' : 'Palavra INVENTADA'}`
    };
}

// Grade Fill in the Blanks (partial credit allowed)
export function gradeFillBlanks(userAnswers, correctAnswers) {
    let totalScore = 0;
    const feedback = [];
    
    correctAnswers.forEach((correct, index) => {
        const user = normalizeText(userAnswers[index] || '');
        const normalized = normalizeText(correct);
        
        if (user === normalized) {
            totalScore += 100;
            feedback.push({ index, correct: true, expected: correct });
        } else {
            const distance = levenshteinDistance(user, normalized);
            const similarity = 1 - (distance / Math.max(normalized.length, 1));
            
            if (similarity >= 0.8) {
                totalScore += 80; // Partial credit for typos
                feedback.push({ index, correct: 'partial', expected: correct, similarity });
            } else {
                totalScore += 0;
                feedback.push({ index, correct: false, expected: correct });
            }
        }
    });
    
    const avgScore = totalScore / correctAnswers.length;
    return {
        score: Math.round(avgScore),
        feedback,
        totalBlanks: correctAnswers.length
    };
}

// Grade Read and Complete (C-test with character-level precision)
export function gradeReadComplete(userAnswers, correctBlanks) {
    let totalScore = 0;
    const feedback = [];
    
    correctBlanks.forEach((blank, index) => {
        const user = normalizeText(userAnswers[index] || '');
        const correct = normalizeText(blank.answer);
        
        if (user === correct) {
            totalScore += 100;
            feedback.push({ index, correct: true, expected: blank.answer });
        } else {
            // For C-test, we're stricter but allow minor typos
            const distance = levenshteinDistance(user, correct);
            if (distance <= 1 && correct.length > 2) {
                totalScore += 50; // Partial credit for close answer
                feedback.push({ index, correct: 'partial', expected: blank.answer });
            } else {
                totalScore += 0;
                feedback.push({ index, correct: false, expected: blank.answer });
            }
        }
    });
    
    const avgScore = totalScore / correctBlanks.length;
    return {
        score: Math.round(avgScore),
        feedback,
        totalBlanks: correctBlanks.length
    };
}

// Grade Listen and Type (word-by-word with Levenshtein)
export function gradeListenAndType(userAnswer, correctAnswer) {
    const userWords = normalizeText(userAnswer).split(/\s+/).filter(Boolean);
    const correctWords = normalizeText(correctAnswer).split(/\s+/).filter(Boolean);
    
    let totalScore = 0;
    const feedback = { words: [], missingWords: 0, extraWords: 0 };
    
    correctWords.forEach((word, i) => {
        if (i < userWords.length) {
            const distance = levenshteinDistance(userWords[i], word);
            const similarity = 1 - (distance / Math.max(word.length, 1));
            
            if (similarity >= 0.8) {
                totalScore += 1;
                feedback.words.push({ index: i, correct: true, word: userWords[i] });
            } else if (similarity >= 0.5) {
                totalScore += 0.5;
                feedback.words.push({ index: i, correct: 'partial', word: userWords[i], expected: word });
            } else {
                feedback.words.push({ index: i, correct: false, word: userWords[i], expected: word });
            }
        } else {
            // Missing word - more severe penalty
            feedback.missingWords++;
        }
    });
    
    // Extra words penalty
    if (userWords.length > correctWords.length) {
        feedback.extraWords = userWords.length - correctWords.length;
    }
    
    const maxScore = correctWords.length;
    const percentage = (totalScore / maxScore) * 100;
    
    return {
        score: Math.round(percentage),
        accuracy: percentage,
        feedback,
        transcript: correctAnswer
    };
}

// Grade Writing (heuristic rubric)
export function gradeWriting(text, rubric) {
    const words = text.split(/\s+/).filter(Boolean);
    const sentences = text.split(/[.!?]+/).filter(s => s.trim());
    const uniqueWords = new Set(words.map(w => w.toLowerCase()));
    
    let score = 0;
    const feedback = [];
    
    // 1. Length (25 points)
    const minWords = rubric.minWords || 30;
    const lengthScore = Math.min(25, Math.round(25 * words.length / minWords));
    score += lengthScore;
    
    if (words.length >= minWords) {
        feedback.push({
            criterion: 'Comprimento',
            score: lengthScore,
            comment: `✓ Texto adequado (${words.length} palavras)`
        });
    } else {
        feedback.push({
            criterion: 'Comprimento',
            score: lengthScore,
            comment: `Texto muito curto: ${words.length}/${minWords} palavras`
        });
    }
    
    // 2. Keyword coverage (25 points)
    if (rubric.keywords && rubric.keywords.length > 0) {
        const foundKeywords = rubric.keywords.filter(kw =>
            text.toLowerCase().includes(kw.toLowerCase())
        );
        const keywordScore = Math.round(25 * foundKeywords.length / rubric.keywords.length);
        score += keywordScore;
        feedback.push({
            criterion: 'Relevância',
            score: keywordScore,
            comment: `Keywords encontradas: ${foundKeywords.length}/${rubric.keywords.length}`
        });
    }
    
    // 3. Lexical diversity (25 points)
    const diversity = uniqueWords.size / Math.max(words.length, 1);
    const diversityScore = Math.round(25 * Math.min(1, diversity / 0.6));
    score += diversityScore;
    feedback.push({
        criterion: 'Diversidade Vocabular',
        score: diversityScore,
        comment: `${(diversity * 100).toFixed(0)}% de palavras únicas`
    });
    
    // 4. Sentence variety (25 points)
    const avgSentenceLength = words.length / Math.max(sentences.length, 1);
    const varietyScore = (avgSentenceLength >= 8 && avgSentenceLength <= 20) ? 25 
                        : (avgSentenceLength >= 5) ? 15 : 5;
    score += varietyScore;
    feedback.push({
        criterion: 'Estrutura de Sentenças',
        score: varietyScore,
        comment: `Média de ${avgSentenceLength.toFixed(1)} palavras por sentença`
    });
    
    return {
        score: Math.min(100, Math.round(score)),
        feedback,
        wordCount: words.length,
        diversity: diversity,
        modelAnswer: rubric.modelAnswer
    };
}

// Grade Speaking (self-assessment with duration check)
export function gradeSpeaking(duration, rubric) {
    const minDuration = rubric.minDuration || 30000; // 30 seconds default
    const maxDuration = rubric.maxDuration || 120000; // 2 minutes default
    
    const feedback = [];
    let durationScore = 0;
    
    if (duration >= minDuration && duration <= maxDuration) {
        durationScore = 100;
        feedback.push({
            criterion: 'Duração',
            score: 100,
            comment: `✓ Duração adequada (${Math.round(duration / 1000)}s)`
        });
    } else if (duration < minDuration) {
        durationScore = Math.round((duration / minDuration) * 100);
        feedback.push({
            criterion: 'Duração',
            score: durationScore,
            comment: `Resposta muito curta: ${Math.round(duration / 1000)}s / ${Math.round(minDuration / 1000)}s`
        });
    } else {
        durationScore = 80;
        feedback.push({
            criterion: 'Duração',
            score: 80,
            comment: `Resposta muito longa (${Math.round(duration / 1000)}s)`
        });
    }
    
    return {
        durationScore,
        feedback,
        needsSelfAssessment: true,
        rubric: rubric.selfAssessmentCriteria || [
            { name: 'Relevância', description: 'Respondi ao tema proposto?' },
            { name: 'Fluência', description: 'Falei de forma natural, sem pausas longas?' },
            { name: 'Vocabulário', description: 'Usei vocabulário variado e apropriado?' },
            { name: 'Gramática', description: 'Usei estruturas gramaticais corretas?' },
            { name: 'Pronúncia', description: 'Minha pronúncia foi clara e compreensível?' }
        ]
    };
}

// Grade multiple choice (exact match)
export function gradeMultipleChoice(userAnswer, correctAnswer) {
    const correct = userAnswer === correctAnswer;
    return {
        score: correct ? 100 : 0,
        correct,
        correctAnswer
    };
}
