// Ultimate Error Logging System
class ErrorLogger {
    constructor() {
        this.logs = [];
        this.maxLogs = 1000;
        this.enabled = true;
        this.logLevel = 'ALL'; // ALL, ERROR, WARN, INFO, DEBUG
        this.init();
    }
    
    init() {
        // Capture all console errors
        window.addEventListener('error', (e) => {
            this.error('GLOBAL ERROR', {
                message: e.message,
                filename: e.filename,
                lineno: e.lineno,
                colno: e.colno,
                error: e.error?.stack
            });
        });
        
        // Capture unhandled promise rejections
        window.addEventListener('unhandledrejection', (e) => {
            this.error('UNHANDLED PROMISE REJECTION', {
                reason: e.reason,
                promise: e.promise
            });
        });
        
        // Override console methods
        this.hookConsole();
        
        this.info('ErrorLogger initialized');
    }
    
    hookConsole() {
        const original = {
            log: console.log,
            error: console.error,
            warn: console.warn,
            info: console.info,
            debug: console.debug
        };
        
        console.log = (...args) => {
            this.debug('CONSOLE.LOG', args);
            original.log.apply(console, args);
        };
        
        console.error = (...args) => {
            this.error('CONSOLE.ERROR', args);
            original.error.apply(console, args);
        };
        
        console.warn = (...args) => {
            this.warn('CONSOLE.WARN', args);
            original.warn.apply(console, args);
        };
        
        console.info = (...args) => {
            this.info('CONSOLE.INFO', args);
            original.info.apply(console, args);
        };
        
        console.debug = (...args) => {
            this.debug('CONSOLE.DEBUG', args);
            original.debug.apply(console, args);
        };
    }
    
    log(level, category, data) {
        if (!this.enabled) return;
        
        const entry = {
            timestamp: new Date().toISOString(),
            level: level,
            category: category,
            data: data,
            url: window.location.href,
            userAgent: navigator.userAgent
        };
        
        this.logs.push(entry);
        
        // Keep logs under max size
        if (this.logs.length > this.maxLogs) {
            this.logs.shift();
        }
        
        // Save to localStorage periodically
        if (this.logs.length % 10 === 0) {
            this.saveToStorage();
        }
        
        return entry;
    }
    
    error(category, data) {
        const entry = this.log('ERROR', category, data);
        // Show in UI for critical errors
        this.showErrorNotification(category, data);
    }
    
    warn(category, data) {
        this.log('WARN', category, data);
    }
    
    info(category, data) {
        this.log('INFO', category, data);
    }
    
    debug(category, data) {
        this.log('DEBUG', category, data);
    }
    
    showErrorNotification(category, data) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: #e74c3c;
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10000;
            max-width: 400px;
            font-family: monospace;
            font-size: 12px;
        `;
        notification.innerHTML = `
            <strong>ERROR: ${category}</strong><br>
            ${JSON.stringify(data, null, 2).substring(0, 200)}
            <div style="margin-top: 8px; font-size: 10px;">Check console for details</div>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transition = 'opacity 0.3s';
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
    
    saveToStorage() {
        try {
            localStorage.setItem('errorLogs', JSON.stringify(this.logs.slice(-100)));
        } catch (e) {
            console.error('Failed to save logs:', e);
        }
    }
    
    getLogs(filter = {}) {
        let filtered = this.logs;
        
        if (filter.level) {
            filtered = filtered.filter(log => log.level === filter.level);
        }
        
        if (filter.category) {
            filtered = filtered.filter(log => log.category.includes(filter.category));
        }
        
        return filtered;
    }
    
    exportLogs() {
        const blob = new Blob([JSON.stringify(this.logs, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `error-logs-${Date.now()}.json`;
        a.click();
    }
    
    clear() {
        this.logs = [];
        localStorage.removeItem('errorLogs');
        this.info('Logs cleared');
    }
    
    showLogViewer() {
        const viewer = document.createElement('div');
        viewer.id = 'logViewer';
        viewer.style.cssText = `
            position: fixed;
            top: 10%;
            left: 10%;
            right: 10%;
            bottom: 10%;
            background: #1a1a2e;
            color: #fff;
            border: 2px solid #FFB800;
            border-radius: 12px;
            z-index: 20000;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        `;
        
        const header = document.createElement('div');
        header.style.cssText = `
            padding: 16px;
            background: #0D1117;
            border-bottom: 1px solid #FFB800;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;
        header.innerHTML = `
            <strong>🔍 Error Log Viewer (${this.logs.length} logs)</strong>
            <div>
                <button onclick="errorLogger.exportLogs()" style="margin-right: 8px; padding: 8px 16px; background: #3498db; border: none; color: white; border-radius: 4px; cursor: pointer;">Export</button>
                <button onclick="errorLogger.clear()" style="margin-right: 8px; padding: 8px 16px; background: #e74c3c; border: none; color: white; border-radius: 4px; cursor: pointer;">Clear</button>
                <button onclick="document.getElementById('logViewer').remove()" style="padding: 8px 16px; background: #95a5a6; border: none; color: white; border-radius: 4px; cursor: pointer;">Close</button>
            </div>
        `;
        
        const content = document.createElement('div');
        content.style.cssText = `
            flex: 1;
            overflow-y: auto;
            padding: 16px;
            font-family: monospace;
            font-size: 12px;
        `;
        
        content.innerHTML = this.logs.slice(-50).reverse().map(log => `
            <div style="margin-bottom: 12px; padding: 12px; background: rgba(255,255,255,0.05); border-left: 4px solid ${
                log.level === 'ERROR' ? '#e74c3c' : 
                log.level === 'WARN' ? '#f39c12' : 
                log.level === 'INFO' ? '#3498db' : '#95a5a6'
            }; border-radius: 4px;">
                <div style="color: #FFB800; margin-bottom: 4px;">
                    <strong>${log.level}</strong> - ${log.category} - ${new Date(log.timestamp).toLocaleTimeString()}
                </div>
                <div style="color: #ddd;">
                    ${JSON.stringify(log.data, null, 2)}
                </div>
            </div>
        `).join('');
        
        viewer.appendChild(header);
        viewer.appendChild(content);
        document.body.appendChild(viewer);
    }
}

// Initialize global error logger
const errorLogger = new ErrorLogger();

// Add to window for global access
window.errorLogger = errorLogger;

// Log initial page load
errorLogger.info('PAGE_LOAD', {
    url: window.location.href,
    timestamp: Date.now(),
    userAgent: navigator.userAgent
});
