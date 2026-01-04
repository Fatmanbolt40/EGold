// Phantom Wallet Integration for Casino

class PhantomWallet {
    constructor() {
        this.provider = null;
        this.publicKey = null;
        this.connected = false;
    }

    // Check if Phantom is installed
    isPhantomInstalled() {
        return window.solana && window.solana.isPhantom;
    }

    // Connect to Phantom wallet
    async connect() {
        try {
            if (typeof errorLogger !== 'undefined') {
                errorLogger.info('PHANTOM_CONNECT_ATTEMPT', { timestamp: Date.now() });
            }
            
            if (!this.isPhantomInstalled()) {
                alert('Phantom wallet not detected! Please install Phantom from https://phantom.app');
                window.open('https://phantom.app', '_blank');
                if (typeof errorLogger !== 'undefined') {
                    errorLogger.warn('PHANTOM_NOT_INSTALLED', {});
                }
                return false;
            }

        try {
            const resp = await window.solana.connect();
            this.provider = window.solana;
            this.publicKey = resp.publicKey.toString();
            this.connected = true;

            console.log('Phantom connected:', this.publicKey);
            
            // Update UI
            this.updateUI();
            
            // Show success message
            effects.createConfetti(window.innerWidth / 2, 100, 50);
            effects.floatingText(
                window.innerWidth / 2,
                150,
                '✅ Wallet Connected!',
                '#2ecc71',
                '2rem'
            );

            return true;
        } catch (err) {
            if (typeof errorLogger !== 'undefined') {
                errorLogger.error('PHANTOM_CONNECT_ERROR', {
                    error: err.message,
                    stack: err.stack,
                    code: err.code
                });
            }
            console.error('Failed to connect to Phantom:', err);
            alert('Failed to connect to Phantom wallet. Please try again.');
            return false;
        }
    }

    // Disconnect wallet
    async disconnect() {
        if (this.provider) {
            try {
                await this.provider.disconnect();
                this.publicKey = null;
                this.connected = false;
                this.updateUI();
                
                effects.floatingText(
                    window.innerWidth / 2,
                    150,
                    'Wallet Disconnected',
                    '#e74c3c',
                    '1.5rem'
                );
            } catch (err) {
                console.error('Error disconnecting:', err);
            }
        }
    }

    // Get eGold balance
    async getBalance() {
        if (!this.connected || !this.provider) return 0;

        try {
            const balance = await this.provider.connection.getBalance(
                this.provider.publicKey
            );
            // Convert lamports to eGold (1 eGold = 1,000,000,000 lamports)
            return balance / 1000000000;
        } catch (err) {
            console.error('Error getting balance:', err);
            return 0;
        }
    }

    // Update UI with wallet info
    updateUI() {
        const walletBtn = document.getElementById('walletConnectBtn');
        const walletInfo = document.getElementById('walletInfo');
        
        if (this.connected && this.publicKey) {
            const shortKey = this.publicKey.slice(0, 4) + '...' + this.publicKey.slice(-4);
            
            if (walletBtn) {
                walletBtn.textContent = shortKey;
                walletBtn.style.background = 'linear-gradient(135deg, #2ecc71, #27ae60)';
            }
            
            if (walletInfo) {
                walletInfo.innerHTML = `
                    <div style="padding: 15px; background: rgba(46, 204, 113, 0.1); border-radius: 10px; margin: 10px 0;">
                        <strong>✅ Connected</strong><br>
                        <span style="font-size: 0.9rem; color: #a0a0b0;">${this.publicKey}</span><br>
                        <button onclick="phantomWallet.disconnect()" style="margin-top: 10px; padding: 8px 15px; background: #e74c3c; border: none; border-radius: 5px; color: white; cursor: pointer;">
                            Disconnect
                        </button>
                    </div>
                `;
            }
        } else {
            if (walletBtn) {
                walletBtn.textContent = '🔗 Connect Wallet';
                walletBtn.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
            }
            
            if (walletInfo) {
                walletInfo.innerHTML = `
                    <div style="padding: 15px; background: rgba(231, 76, 60, 0.1); border-radius: 10px; margin: 10px 0;">
                        <strong>❌ Not Connected</strong><br>
                        <span style="font-size: 0.9rem; color: #a0a0b0;">Connect your Phantom wallet to play</span>
                    </div>
                `;
            }
        }
    }

    // Auto-connect if previously authorized
    async autoConnect() {
        try {
            if (typeof errorLogger !== 'undefined') {
                errorLogger.info('PHANTOM_AUTO_CONNECT_ATTEMPT', {});
            }
            
            if (this.isPhantomInstalled()) {
                try {
                    const resp = await window.solana.connect({ onlyIfTrusted: true });
                    this.provider = window.solana;
                    this.publicKey = resp.publicKey.toString();
                    this.connected = true;
                    this.updateUI();
                    console.log('Auto-connected to Phantom');
                    if (typeof errorLogger !== 'undefined') {
                        errorLogger.info('PHANTOM_AUTO_CONNECTED', { publicKey: this.publicKey });
                    }
                } catch (err) {
                    // User hasn't authorized auto-connect yet
                    console.log('Auto-connect not authorized');
                    if (typeof errorLogger !== 'undefined') {
                        errorLogger.warn('PHANTOM_AUTO_CONNECT_NOT_AUTHORIZED', { error: err.message });
                    }
                }
            }
        } catch (error) {
            if (typeof errorLogger !== 'undefined') {
                errorLogger.error('PHANTOM_AUTO_CONNECT_ERROR', {
                    error: error.message,
                    stack: error.stack
                });
            }
            console.error('Auto-connect error:', error);
        }
    }
}

// Global instance
const phantomWallet = new PhantomWallet();
window.phantomWallet = phantomWallet;

// Try to auto-connect when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => phantomWallet.autoConnect(), 100);
    });
} else {
    setTimeout(() => phantomWallet.autoConnect(), 100);
}
