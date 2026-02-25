// questionBank.js - Complete question bank with all 19 DET question types

export const questionBank = {
    metadata: {
        version: "2025.2",
        lastUpdated: "2025-02-25"
    },
    
    // 1. READ AND SELECT (15-18 questions)
    readAndSelect: [
        { id: "rs001", word: "RESILIENT", isReal: true, difficulty: 2 },
        { id: "rs002", word: "APLASTER", isReal: false, difficulty: 1 },
        { id: "rs003", word: "UBIQUITOUS", isReal: true, difficulty: 3 },
        { id: "rs004", word: "FLUMINATE", isReal: false, difficulty: 2 },
        { id: "rs005", word: "COHERENT", isReal: true, difficulty: 2 },
        { id: "rs006", word: "PLENDID", isReal: false, difficulty: 1 },
        { id: "rs007", word: "METICULOUS", isReal: true, difficulty: 3 },
        { id: "rs008", word: "EMBARK", isReal: true, difficulty: 2 },
        { id: "rs009", word: "PRECTICE", isReal: false, difficulty: 1 },
        { id: "rs010", word: "ELOQUENT", isReal: true, difficulty: 3 }
    ],
    
    // 2. FILL IN THE BLANKS (6-9 questions)
    fillBlanks: [
        {
            id: "fb001",
            difficulty: 2,
            sentence: "The weather was _____ cold that we had to cancel the picnic.",
            answer: "so",
            alternatives: ["too", "very", "such"]
        },
        {
            id: "fb002",
            difficulty: 2,
            sentence: "She has been working here _____ 2020.",
            answer: "since",
            alternatives: ["for", "from", "during"]
        },
        {
            id: "fb003",
            difficulty: 3,
            sentence: "Despite _____ tired, she continued working on the project.",
            answer: "being",
            alternatives: ["be", "to be", "been"]
        }
    ],
    
    // 3. READ AND COMPLETE (C-test) (3-6 questions)
    readComplete: [
        {
            id: "rc001",
            difficulty: 2,
            passage: "The arena seats over 21,000 and is the largest indoor are__ i_ Europe. It h__ been vo___ International Venue of t__ Year.",
            blanks: [
                { position: 0, given: "are", answer: "na" },
                { position: 1, given: "i", answer: "n" },
                { position: 2, given: "h", answer: "as" },
                { position: 3, given: "vo", answer: "ted" },
                { position: 4, given: "t", answer: "he" }
            ],
            fullText: "The arena seats over 21,000 and is the largest indoor arena in Europe. It has been voted International Venue of the Year."
        },
        {
            id: "rc002",
            difficulty: 3,
            passage: "Climate cha___ is one of t__ most pre_____ issues fac___ humanity tod___. Scientists war_ that without imme_____ action, the conse______ could be catastro____.",
            blanks: [
                { position: 0, given: "cha", answer: "nge" },
                { position: 1, given: "t", answer: "he" },
                { position: 2, given: "pre", answer: "ssing" },
                { position: 3, given: "fac", answer: "ing" },
                { position: 4, given: "tod", answer: "ay" },
                { position: 5, given: "war", answer: "n" },
                { position: 6, given: "imme", answer: "diate" },
                { position: 7, given: "conse", answer: "quences" },
                { position: 8, given: "catastro", answer: "phic" }
            ],
            fullText: "Climate change is one of the most pressing issues facing humanity today. Scientists warn that without immediate action, the consequences could be catastrophic."
        }
    ],
    
    // 4. LISTEN AND TYPE (6-9 questions)
    listenType: [
        {
            id: "lt001",
            difficulty: 2,
            transcript: "The museum has an incredible collection of ancient artifacts.",
            audioText: "The museum has an incredible collection of ancient artifacts.",
            maxReplays: 2
        },
        {
            id: "lt002",
            difficulty: 2,
            transcript: "She decided to pursue a career in environmental science.",
            audioText: "She decided to pursue a career in environmental science.",
            maxReplays: 2
        },
        {
            id: "lt003",
            difficulty: 3,
            transcript: "The committee unanimously approved the proposal after lengthy deliberations.",
            audioText: "The committee unanimously approved the proposal after lengthy deliberations.",
            maxReplays: 2
        }
    ],
    
    // 5. WRITE ABOUT THE PHOTO (3 questions)
    writePhoto: [
        {
            id: "wap001",
            difficulty: 2,
            image: "placeholder_autumn_walk.jpg",
            imageDescription: "Two people walking on a sidewalk covered with autumn leaves",
            keywords: ["people", "walking", "sidewalk", "autumn", "leaves", "trees"],
            minWords: 30,
            modelAnswer: "In this photo, I see two people walking along a sidewalk covered with autumn leaves. They appear to be a father and son, possibly heading to school or work. Both are carrying bags. The ground is covered with orange and yellow leaves, and they are wearing sweaters, which suggests it is autumn. The trees in the background have lost most of their leaves, confirming the season."
        },
        {
            id: "wap002",
            difficulty: 2,
            image: "placeholder_beach.jpg",
            imageDescription: "Family playing on a sunny beach",
            keywords: ["beach", "family", "playing", "sand", "ocean", "sunny"],
            minWords: 30,
            modelAnswer: "This photo shows a family enjoying a day at the beach. There are adults and children playing in the sand near the water. The sky is clear and blue, indicating good weather. Some people appear to be building sandcastles while others are closer to the ocean. Everyone seems to be having a great time together in this outdoor summer activity."
        }
    ],
    
    // 6. SPEAK ABOUT THE PHOTO (1 question per test)
    speakPhoto: [
        {
            id: "sap001",
            difficulty: 2,
            image: "placeholder_office.jpg",
            imageDescription: "Modern office workspace with people collaborating",
            keywords: ["office", "workspace", "people", "computers", "collaboration"],
            minDuration: 30000,
            maxDuration: 90000,
            modelAnswer: "In this image, I can see a modern office environment. There are several people working together at desks with computers. The workspace looks bright and open, with large windows providing natural light. Some people appear to be having a discussion, while others are focused on their computer screens. This seems like a collaborative working environment typical of contemporary offices."
        }
    ],
    
    // 7. INTERACTIVE WRITING (1 question per test, 2 parts)
    interactiveWriting: [
        {
            id: "iw001",
            difficulty: 2,
            part1: {
                prompt: "A local community center is planning activities for seniors. Write an email suggesting two activities and explaining why they would be beneficial.",
                minWords: 50,
                timeLimit: 300000 // 5 minutes
            },
            part2: {
                prompt: "The community center coordinator replied that they love your ideas but have a limited budget. Respond to their concern and suggest how to implement your activities affordably.",
                minWords: 50,
                timeLimit: 180000 // 3 minutes
            }
        }
    ],
    
    // 8. READ THEN SPEAK (1 question per test)
    readSpeak: [
        {
            id: "rts001",
            difficulty: 2,
            passage: "Recent studies show that regular physical exercise not only improves physical health but also has significant benefits for mental well-being. Researchers found that people who exercise regularly report lower levels of stress and anxiety.",
            question: "Based on the passage, explain the benefits of regular exercise.",
            minDuration: 30000,
            maxDuration: 90000
        }
    ],
    
    // 9. INTERACTIVE SPEAKING (NEW - 1 per test, 6 sub-questions)
    interactiveSpeaking: [
        {
            id: "is001",
            difficulty: 2,
            scenario: "You're planning a birthday party for a friend",
            questions: [
                "What kind of party would you organize?",
                "Where would you hold the party?",
                "Who would you invite?",
                "What food would you serve?",
                "What activities would you plan?",
                "How would you make it special for your friend?"
            ],
            timePerQuestion: 35000 // 35 seconds each
        }
    ],
    
    // 10. INTERACTIVE READING (1 set with 5 sub-types)
    interactiveReading: [
        {
            id: "ir001",
            passage: "John decided to fix a few things around the house himself instead of calling a professional. He started with replacing a light switch but soon realized he had turned off the wrong circuit breaker. When he flipped the switch, nothing happened. Frustrated, he checked the fuse box again and discovered his mistake. After turning off the correct breaker, he successfully completed the repair. However, he decided that next time, he would hire an electrician.",
            completeSentences: [
                {
                    sentence: "John wanted to avoid calling a _____ to save money.",
                    options: ["professional", "friend", "neighbor", "family member"],
                    correct: "professional"
                }
            ],
            completePassage: [
                {
                    gap: 0,
                    options: [
                        "He realized he had made an error with the circuit breaker",
                        "He decided to stop working on the project",
                        "He called a professional for help",
                        "He bought new tools"
                    ],
                    correct: 0
                }
            ],
            highlightAnswer: {
                question: "What did John decide to do next time?",
                correctStart: 280,
                correctEnd: 320,
                correctText: "hire an electrician"
            },
            identifyIdea: {
                question: "What is the main idea of this passage?",
                options: [
                    "DIY repairs can be challenging and sometimes require professional help",
                    "Circuit breakers are dangerous",
                    "Light switches are easy to replace",
                    "Electricians are expensive"
                ],
                correct: 0
            },
            titlePassage: {
                options: [
                    "John's Electrical Difficulties",
                    "How to Replace a Light Switch",
                    "The Dangers of DIY",
                    "A Day in John's Life"
                ],
                correct: 0
            }
        }
    ],
    
    // 11. INTERACTIVE LISTENING (1 set with conversation)
    interactiveListening: [
        {
            id: "il001",
            audioText: "Conversation between two colleagues",
            transcript: "A: Hey Sarah, have you seen the new project timeline?\nB: Yes, I just reviewed it this morning. It seems quite ambitious.\nA: I agree. Do you think we can meet the deadline?\nB: It'll be challenging, but if we prioritize the key features and work efficiently, I think it's doable.\nA: That's a good approach. Should we schedule a team meeting to discuss priorities?\nB: Definitely. How about tomorrow afternoon?",
            questions: [
                {
                    question: "What are they discussing?",
                    options: [
                        "A project timeline",
                        "A vacation plan",
                        "A new employee",
                        "Office renovations"
                    ],
                    correct: 0
                },
                {
                    question: "How does Sarah feel about the timeline?",
                    options: [
                        "It's too easy",
                        "It's ambitious but possible",
                        "It's impossible",
                        "She hasn't looked at it"
                    ],
                    correct: 1
                }
            ],
            maxReplays: 1
        }
    ],
    
    // 12. SUMMARIZE THE CONVERSATION (2 questions)
    summarizeConversation: [
        {
            id: "sc001",
            difficulty: 3,
            audioText: "Customer service conversation",
            transcript: "Customer: Hi, I ordered a laptop three weeks ago but it still hasn't arrived.\nAgent: I apologize for the delay. Let me check your order status. Can you provide your order number?\nCustomer: It's #45789.\nAgent: Thank you. I see the shipment was delayed due to a warehouse issue. The good news is it shipped yesterday and should arrive within 2-3 business days. I'll also apply a 15% discount to your account for the inconvenience.\nCustomer: That's helpful, thank you for resolving this.",
            minWords: 30,
            maxWords: 75,
            timeLimit: 75000,
            keywords: ["laptop", "delay", "warehouse", "shipped", "discount"]
        }
    ],
    
    // 13. WRITING SAMPLE (1 per test)
    writingSample: [
        {
            id: "ws001",
            difficulty: 2,
            topic: "Describe a place you would like to visit and explain why.",
            minWords: 130,
            timeLimit: 300000, // 5 minutes
            keywords: ["place", "visit", "why", "interesting"]
        },
        {
            id: "ws002",
            difficulty: 2,
            topic: "What is your opinion on remote work? Discuss its advantages and disadvantages.",
            minWords: 130,
            timeLimit: 300000
        }
    ],
    
    // 14. SPEAKING SAMPLE (1 per test)
    speakingSample: [
        {
            id: "ss001",
            difficulty: 2,
            topic: "Talk about a skill you would like to learn and why it interests you.",
            minDuration: 60000, // 1 minute
            maxDuration: 180000, // 3 minutes
            selfAssessmentCriteria: [
                { name: "Relevância", description: "Respondi ao tema proposto?" },
                { name: "Fluência", description: "Falei de forma natural?" },
                { name: "Vocabulário", description: "Usei vocabulário variado?" },
                { name: "Gramática", description: "Usei estruturas corretas?" },
                { name: "Pronúncia", description: "Minha pronúncia foi clara?" }
            ]
        }
    ]
};

// Function to generate a complete test (52 questions)
export function generateFullTest() {
    const questions = [];
    
    // Add Read and Select (15-18 questions) - we'll use 15
    const readSelectQuestions = shuffleArray([...questionBank.readAndSelect]).slice(0, 15);
    readSelectQuestions.forEach(q => {
        questions.push({
            ...q,
            type: 'read-select',
            timeLimit: 5000,
            subscores: ['Reading', 'Literacy', 'Comprehension']
        });
    });
    
    // Add Fill in the Blanks (6-9 questions) - we'll use 6
    const fillBlanksQuestions = shuffleArray([...questionBank.fillBlanks]).slice(0, 6);
    fillBlanksQuestions.forEach(q => {
        questions.push({
            ...q,
            type: 'fill-blanks',
            timeLimit: 20000,
            subscores: ['Reading', 'Literacy', 'Comprehension']
        });
    });
    
    // Add Read and Complete (3-6 questions) - we'll use 3
    const readCompleteQuestions = shuffleArray([...questionBank.readComplete]).slice(0, 3);
    readCompleteQuestions.forEach(q => {
        questions.push({
            ...q,
            type: 'read-complete',
            timeLimit: 180000,
            subscores: ['Reading', 'Literacy', 'Comprehension']
        });
    });
    
    // Add Listen and Type (6-9 questions) - we'll use 6
    const listenTypeQuestions = shuffleArray([...questionBank.listenType]).slice(0, 6);
    listenTypeQuestions.forEach(q => {
        questions.push({
            ...q,
            type: 'listen-type',
            timeLimit: 60000,
            subscores: ['Listening', 'Comprehension', 'Conversation']
        });
    });
    
    // Add Write About the Photo (3 questions)
    questionBank.writePhoto.forEach(q => {
        questions.push({
            ...q,
            type: 'write-photo',
            timeLimit: 60000,
            subscores: ['Writing', 'Literacy', 'Production']
        });
    });
    
    // Add Speak About the Photo (1 question)
    questions.push({
        ...questionBank.speakPhoto[0],
        type: 'speak-photo',
        timeLimit: 90000,
        subscores: ['Speaking', 'Conversation', 'Production']
    });
    
    // Add Interactive Writing (1 question with 2 parts)
    questions.push({
        ...questionBank.interactiveWriting[0],
        type: 'interactive-writing',
        subscores: ['Writing', 'Literacy', 'Production']
    });
    
    // Add Read Then Speak (1 question)
    questions.push({
        ...questionBank.readSpeak[0],
        type: 'read-speak',
        subscores: ['Speaking', 'Reading', 'Production']
    });
    
    // Add Interactive Speaking (1 question with 6 sub-questions)
    questions.push({
        ...questionBank.interactiveSpeaking[0],
        type: 'interactive-speaking',
        subscores: ['Speaking', 'Conversation', 'Production']
    });
    
    // Add Interactive Reading (1 set)
    questions.push({
        ...questionBank.interactiveReading[0],
        type: 'interactive-reading',
        timeLimit: 420000,
        subscores: ['Reading', 'Literacy', 'Comprehension']
    });
    
    // Add Interactive Listening (1 set)
    questions.push({
        ...questionBank.interactiveListening[0],
        type: 'interactive-listening',
        timeLimit: 240000,
        subscores: ['Listening', 'Comprehension', 'Conversation']
    });
    
    // Add Summarize the Conversation (2 questions)
    questionBank.summarizeConversation.forEach(q => {
        questions.push({
            ...q,
            type: 'summarize-conversation',
            subscores: ['Writing', 'Listening', 'Literacy', 'Comprehension']
        });
    });
    
    // Add Writing Sample (1 question)
    questions.push({
        ...questionBank.writingSample[0],
        type: 'writing-sample',
        subscores: ['Writing', 'Literacy', 'Production']
    });
    
    // Add Speaking Sample (1 question)
    questions.push({
        ...questionBank.speakingSample[0],
        type: 'speaking-sample',
        subscores: ['Speaking', 'Conversation', 'Production']
    });
    
    // Shuffle to simulate adaptive nature (in real test, questions adapt based on performance)
    return shuffleArray(questions);
}

// Helper function to shuffle array
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}
