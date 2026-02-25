// storage.js - Data persistence with localStorage and IndexedDB

const PREFIX = 'det_sim_';
const DB_NAME = 'DETSimulator';
const DB_VERSION = 1;

// localStorage wrapper
export const LocalStorage = {
    save(key, value) {
        try {
            localStorage.setItem(PREFIX + key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('LocalStorage save error:', error);
            return false;
        }
    },
    
    load(key, fallback = null) {
        try {
            const item = localStorage.getItem(PREFIX + key);
            return item ? JSON.parse(item) : fallback;
        } catch (error) {
            console.error('LocalStorage load error:', error);
            return fallback;
        }
    },
    
    remove(key) {
        try {
            localStorage.removeItem(PREFIX + key);
            return true;
        } catch (error) {
            console.error('LocalStorage remove error:', error);
            return false;
        }
    },
    
    // Save test score to history
    saveScore(score) {
        const history = this.load('score_history', []);
        history.push({
            ...score,
            completedAt: Date.now(),
            id: Date.now().toString()
        });
        this.save('score_history', history);
    },
    
    // Get score history
    getHistory() {
        return this.load('score_history', []);
    },
    
    // Clear all data
    clearAll() {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith(PREFIX)) {
                localStorage.removeItem(key);
            }
        });
    }
};

// IndexedDB wrapper
class IndexedDBWrapper {
    constructor() {
        this.db = null;
    }
    
    async open() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Create object stores
                if (!db.objectStoreNames.contains('tests')) {
                    db.createObjectStore('tests', { keyPath: 'id', autoIncrement: true });
                }
                
                if (!db.objectStoreNames.contains('recordings')) {
                    db.createObjectStore('recordings', { keyPath: 'questionId' });
                }
            };
        });
    }
    
    async saveTest(testData) {
        if (!this.db) await this.open();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['tests'], 'readwrite');
            const store = transaction.objectStore('tests');
            const request = store.add(testData);
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }
    
    async getTests() {
        if (!this.db) await this.open();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['tests'], 'readonly');
            const store = transaction.objectStore('tests');
            const request = store.getAll();
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }
    
    async saveRecording(questionId, blob) {
        if (!this.db) await this.open();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['recordings'], 'readwrite');
            const store = transaction.objectStore('recordings');
            const request = store.put({ questionId, blob, timestamp: Date.now() });
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }
    
    async getRecording(questionId) {
        if (!this.db) await this.open();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['recordings'], 'readonly');
            const store = transaction.objectStore('recordings');
            const request = store.get(questionId);
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }
    
    async clearRecordings() {
        if (!this.db) await this.open();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['recordings'], 'readwrite');
            const store = transaction.objectStore('recordings');
            const request = store.clear();
            
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }
}

export const IndexedDB = new IndexedDBWrapper();

// Initialize IndexedDB on module load
IndexedDB.open().catch(err => {
    console.warn('IndexedDB initialization failed:', err);
    console.log('Recording features may not be available');
});
