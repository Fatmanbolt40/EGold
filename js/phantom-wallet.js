// Phantom Wallet Integration for Casino

class PhantomWallet {
    constructor() {
        this.provider = null;
        this.publicKey = null;
        this.connected = false;
        this.eGoldMint = 'mntzrj9TrAmybpqz7WovMsY4mWFVdUCQQD6WhmeN1TL'; // eGold SPL Token
        this.connection = null;
        this.siteWallet = null; // User's casino wallet (generated)
        this.houseWallet = 'HOUSE_WALLET_ADDRESS_HERE'; // Replace with actual house wallet
    }
    
    // Generate or load user's site wallet
    generateSiteWallet() {
        const stored = localStorage.getItem('siteWalletKey');
        if (stored) {
            try {
                const secretKey = Uint8Array.from(JSON.parse(stored));
                this.siteWallet = window.solanaWeb3.Keypair.fromSecretKey(secretKey);
            } catch (e) {
                console.error('Error loading wallet:', e);
                this.siteWallet = window.solanaWeb3.Keypair.generate();
                localStorage.setItem('siteWalletKey', JSON.stringify(Array.from(this.siteWallet.secretKey)));
            }
        } else {
            this.siteWallet = window.solanaWeb3.Keypair.generate();
            localStorage.setItem('siteWalletKey', JSON.stringify(Array.from(this.siteWallet.secretKey)));
        }
        
        console.log('Site wallet:', this.siteWallet.publicKey.toString());
        return this.siteWallet.publicKey.toString();
    }
    
    // Register account in admin database
    async registerAccount() {
        if (!this.siteWallet || !this.publicKey) return;
        
        const accountDatabase = JSON.parse(localStorage.getItem('accountDatabase') || '[]');
        
        // Check if account already exists
        const existingIndex = accountDatabase.findIndex(
            acc => acc.siteWallet === this.siteWallet.publicKey.toString()
        );
        
        const balance = await this.getSiteWalletBalance();
        
        const accountData = {
            siteWallet: this.siteWallet.publicKey.toString(),
            phantomWallet: this.publicKey,
            balance: balance,
            lastActive: new Date().toISOString(),
            sessionId: this.generateSessionId(),
            isCurrent: true
        };
        
        if (existingIndex >= 0) {
            // Update existing
            accountDatabase[existingIndex] = accountData;
        } else {
            // Add new
            accountDatabase.push(accountData);
        }
        
        localStorage.setItem('accountDatabase', JSON.stringify(accountDatabase));
    }
    
    generateSessionId() {
        return 'SES-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }
    
    // Get site wallet balance
    async getSiteWalletBalance() {
        if (!this.siteWallet) this.generateSiteWallet();
        
        try {
            const { PublicKey } = window.solanaWeb3;
            const mintPublicKey = new PublicKey(this.eGoldMint);
            
            if (!this.connection) {
                this.connection = new window.solanaWeb3.Connection(
                    'https://mainnet.helius-rpc.com/?api-key=8bc73df4-6f6b-441d-953c-335e77d0d0d7',
                    'confirmed'
                );
            }
            
            const { getAssociatedTokenAddress } = window.splToken;
            const tokenAccount = await getAssociatedTokenAddress(
                mintPublicKey,
                this.siteWallet.publicKey
            );
            
            const balance = await this.connection.getTokenAccountBalance(tokenAccount);
            
            if (balance && balance.value) {
                return parseFloat(balance.value.uiAmount || 0);
            }
            
            return 0;
        } catch (err) {
            // Silently fail on RPC errors (rate limits are common on free tier)
            // Also handle "account not found" which is normal for new wallets
            if (err.message && (err.message.includes('403') || err.message.includes('429') || err.message.includes('could not find account'))) {
                // Account doesn't exist yet - will be created on first deposit
                return 0;
            } else {
                console.error('Error getting site wallet balance:', err);
            }
            return 0;
        }
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

            const resp = await window.solana.connect();
            this.provider = window.solana;
            this.publicKey = resp.publicKey.toString();
            this.connected = true;
            
            // Create RPC connection (use QuickNode free endpoint with better limits)
            this.connection = new window.solanaWeb3.Connection(
                'https://mainnet.helius-rpc.com/?api-key=8bc73df4-6f6b-441d-953c-335e77d0d0d7',
                'confirmed'
            );

            console.log('Phantom connected:', this.publicKey);
            
            // Get eGold balance and update global balance
            await this.syncBalance();
            
            // Generate site wallet if not exists
            this.generateSiteWallet();
            
            // Register account in admin database
            this.registerAccount();
            
            // Update UI
            this.updateUI();
            
            // Show deposit prompt if balance is 0
            const siteBalance = await this.getSiteWalletBalance();
            if (siteBalance === 0) {
                setTimeout(() => this.showDepositPrompt(), 1000);
            }
            
            // Show success message with visual effects
            if (typeof effects !== 'undefined') {
                effects.createConfetti(window.innerWidth / 2, 100, 50);
                effects.floatingText(
                    window.innerWidth / 2,
                    150,
                    '✅ Wallet Connected!',
                    '#2ecc71',
                    '2rem'
                );
            } else {
                console.log('✅ Wallet Connected!');
            }

            return true;
        } catch (err) {
            // Check if user rejected the request (not a real error)
            if (err.message && err.message.includes('rejected')) {
                if (typeof errorLogger !== 'undefined') {
                    errorLogger.warn('PHANTOM_USER_REJECTED', {
                        message: 'User cancelled wallet connection'
                    });
                }
                console.log('Wallet connection cancelled by user');
                // Don't show alert for user cancellation
                return false;
            }
            
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
                
                if (typeof effects !== 'undefined') {
                    effects.floatingText(
                        window.innerWidth / 2,
                        150,
                        'Wallet Disconnected',
                        '#e74c3c',
                        '1.5rem'
                    );
                }
            } catch (err) {
                console.error('Error disconnecting:', err);
            }
        }
    }

    // Get eGold SPL token balance
    async getBalance() {
        if (!this.connected || !this.provider) return 0;

        try {
            const { PublicKey } = window.solanaWeb3;
            const ownerPublicKey = new PublicKey(this.publicKey);
            const mintPublicKey = new PublicKey(this.eGoldMint);
            
            // Get or create connection
            if (!this.connection) {
                this.connection = new window.solanaWeb3.Connection(
                    'https://mainnet.helius-rpc.com/?api-key=8bc73df4-6f6b-441d-953c-335e77d0d0d7'
                );
            }
            
            // Find the associated token account
            const { getAssociatedTokenAddress } = window.splToken;
            const tokenAccount = await getAssociatedTokenAddress(
                mintPublicKey,
                ownerPublicKey
            );
            
            // Get token account balance
            const balance = await this.connection.getTokenAccountBalance(tokenAccount);
            
            if (balance && balance.value) {
                return parseFloat(balance.value.uiAmount || 0);
            }
            
            return 0;
        } catch (err) {
            console.error('Error getting eGold balance:', err);
            // If token account doesn't exist, balance is 0
            return 0;
        }
    }
    
    // Sync wallet balance to global balance variable
    async syncBalance() {
        if (!this.siteWallet) this.generateSiteWallet();
        
        const eGoldBalance = await this.getSiteWalletBalance();
        if (typeof updateBalance === 'function') {
            // Set balance without adding/subtracting
            balance = eGoldBalance;
            updateBalance(0);
        }
        
        // Update admin database
        await this.updateAccountInDatabase(eGoldBalance);
        
        return eGoldBalance;
    }
    
    // Update account balance in admin database
    async updateAccountInDatabase(newBalance) {
        if (!this.siteWallet) return;
        
        const accountDatabase = JSON.parse(localStorage.getItem('accountDatabase') || '[]');
        const index = accountDatabase.findIndex(
            acc => acc.siteWallet === this.siteWallet.publicKey.toString()
        );
        
        if (index >= 0) {
            accountDatabase[index].balance = newBalance;
            accountDatabase[index].lastActive = new Date().toISOString();
            localStorage.setItem('accountDatabase', JSON.stringify(accountDatabase));
        }
    }
    
    // Deposit eGold from Phantom to site wallet
    async deposit(amount) {
        if (!this.connected || !this.provider) {
            alert('Please connect your wallet first!');
            return false;
        }
        
        if (!this.siteWallet) this.generateSiteWallet();
        
        try {
            const { PublicKey, Transaction, SystemProgram } = window.solanaWeb3;
            const { 
                createAssociatedTokenAccountInstruction,
                createTransferInstruction,
                getAssociatedTokenAddress,
                TOKEN_PROGRAM_ID,
                ASSOCIATED_TOKEN_PROGRAM_ID
            } = window.splToken;
            
            const mintPublicKey = new PublicKey(this.eGoldMint);
            const fromPubkey = new PublicKey(this.publicKey);
            const toPubkey = this.siteWallet.publicKey;
            
            // Get or create connection
            if (!this.connection) {
                this.connection = new window.solanaWeb3.Connection(
                    'https://mainnet.helius-rpc.com/?api-key=8bc73df4-6f6b-441d-953c-335e77d0d0d7'
                );
            }
            
            // Get token accounts
            const fromTokenAccount = await getAssociatedTokenAddress(
                mintPublicKey,
                fromPubkey
            );
            
            const toTokenAccount = await getAssociatedTokenAddress(
                mintPublicKey,
                toPubkey
            );
            
            // Get token decimals
            const mintInfo = await this.connection.getParsedAccountInfo(mintPublicKey);
            const decimals = mintInfo.value?.data?.parsed?.info?.decimals || 9;
            const transferAmount = amount * Math.pow(10, decimals);
            
            // Build transaction
            const transaction = new Transaction();
            
            // Check if destination token account exists
            const toAccountInfo = await this.connection.getAccountInfo(toTokenAccount);
            if (!toAccountInfo) {
                // Create associated token account
                transaction.add(
                    createAssociatedTokenAccountInstruction(
                        fromPubkey,
                        toTokenAccount,
                        toPubkey,
                        mintPublicKey,
                        TOKEN_PROGRAM_ID,
                        ASSOCIATED_TOKEN_PROGRAM_ID
                    )
                );
            }
            
            // Add transfer instruction
            transaction.add(
                createTransferInstruction(
                    fromTokenAccount,
                    toTokenAccount,
                    fromPubkey,
                    transferAmount,
                    [],
                    TOKEN_PROGRAM_ID
                )
            );
            
            // Get recent blockhash
            const { blockhash } = await this.connection.getLatestBlockhash();
            transaction.recentBlockhash = blockhash;
            transaction.feePayer = fromPubkey;
            
            // Sign and send
            const signed = await this.provider.signAndSendTransaction(transaction);
            console.log('Deposit transaction:', signed.signature);
            
            // Wait for confirmation
            await this.connection.confirmTransaction(signed.signature);
            
            // Update balance
            await this.syncBalance();
            
            effects.createConfetti(window.innerWidth / 2, window.innerHeight / 2, 100);
            effects.floatingText(
                window.innerWidth / 2,
                window.innerHeight / 2,
                `💰 Deposited ${amount} eGold!`,
                '#2ecc71',
                '2rem'
            );
            
            return true;
        } catch (err) {
            console.error('Deposit error:', err);
            alert('Deposit failed: ' + err.message);
            return false;
        }
    }
    
    // Withdraw eGold from site wallet to Phantom
    async withdraw(amount) {
        if (!this.connected || !this.provider) {
            alert('Please connect your wallet first!');
            return false;
        }
        
        if (!this.siteWallet) {
            alert('No site wallet found!');
            return false;
        }
        
        const siteBalance = await this.getSiteWalletBalance();
        if (amount > siteBalance) {
            alert(`Insufficient balance! You have ${siteBalance.toFixed(2)} eGold`);
            return false;
        }
        
        try {
            const { PublicKey, Transaction, sendAndConfirmTransaction } = window.solanaWeb3;
            const { 
                createAssociatedTokenAccountInstruction,
                createTransferInstruction,
                getAssociatedTokenAddress,
                TOKEN_PROGRAM_ID,
                ASSOCIATED_TOKEN_PROGRAM_ID
            } = window.splToken;
            
            const mintPublicKey = new PublicKey(this.eGoldMint);
            const fromPubkey = this.siteWallet.publicKey;
            const toPubkey = new PublicKey(this.publicKey);
            
            if (!this.connection) {
                this.connection = new window.solanaWeb3.Connection(
                    'https://mainnet.helius-rpc.com/?api-key=8bc73df4-6f6b-441d-953c-335e77d0d0d7'
                );
            }
            
            // Get token accounts
            const fromTokenAccount = await getAssociatedTokenAddress(
                mintPublicKey,
                fromPubkey
            );
            
            const toTokenAccount = await getAssociatedTokenAddress(
                mintPublicKey,
                toPubkey
            );
            
            // Get token decimals
            const mintInfo = await this.connection.getParsedAccountInfo(mintPublicKey);
            const decimals = mintInfo.value?.data?.parsed?.info?.decimals || 9;
            const transferAmount = amount * Math.pow(10, decimals);
            
            // Build transaction
            const transaction = new Transaction();
            
            // Check if destination token account exists
            const toAccountInfo = await this.connection.getAccountInfo(toTokenAccount);
            if (!toAccountInfo) {
                // Create associated token account (user pays for this)
                transaction.add(
                    createAssociatedTokenAccountInstruction(
                        fromPubkey, // Site wallet pays
                        toTokenAccount,
                        toPubkey,
                        mintPublicKey,
                        TOKEN_PROGRAM_ID,
                        ASSOCIATED_TOKEN_PROGRAM_ID
                    )
                );
            }
            
            // Add transfer instruction
            transaction.add(
                createTransferInstruction(
                    fromTokenAccount,
                    toTokenAccount,
                    fromPubkey,
                    transferAmount,
                    [],
                    TOKEN_PROGRAM_ID
                )
            );
            
            // Get recent blockhash
            const { blockhash } = await this.connection.getLatestBlockhash();
            transaction.recentBlockhash = blockhash;
            transaction.feePayer = fromPubkey;
            
            // Sign with site wallet
            transaction.sign(this.siteWallet);
            
            // Send transaction
            const signature = await this.connection.sendRawTransaction(transaction.serialize());
            console.log('Withdrawal transaction:', signature);
            
            // Wait for confirmation
            await this.connection.confirmTransaction(signature);
            
            // Update balance
            await this.syncBalance();
            
            effects.createConfetti(window.innerWidth / 2, window.innerHeight / 2, 100);
            effects.floatingText(
                window.innerWidth / 2,
                window.innerHeight / 2,
                `✅ Withdrew ${amount} eGold!`,
                '#FFB800',
                '2rem'
            );
            
            return true;
        } catch (err) {
            console.error('Withdrawal error:', err);
            alert('Withdrawal failed: ' + err.message);
            return false;
        }
    }
    
    // Show deposit prompt
    showDepositPrompt() {
        const modal = document.createElement('div');
        modal.id = 'depositModal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;
        
        modal.innerHTML = `
            <div style="background: linear-gradient(135deg, #1a2a6c, #0f1f3d); padding: 40px; border-radius: 20px; border: 3px solid #FFB800; max-width: 600px; text-align: center; box-shadow: 0 20px 60px rgba(0,0,0,0.5);">
                <h2 style="color: #FFB800; font-size: 2.5em; margin-bottom: 20px;">💰 Deposit eGold to Play</h2>
                <p style="color: #ccc; font-size: 1.2em; margin-bottom: 30px;">Load your casino wallet with eGold tokens to start playing!</p>
                
                <div style="background: rgba(255,184,0,0.1); padding: 20px; border-radius: 10px; margin-bottom: 30px; border: 2px solid #FFB800;">
                    <div style="color: #888; font-size: 0.9em; margin-bottom: 10px;">Your Casino Wallet</div>
                    <div style="color: #FFB800; font-family: monospace; font-size: 0.9em; word-break: break-all;">${this.siteWallet ? this.siteWallet.publicKey.toString() : 'Loading...'}</div>
                    <div style="color: #2ecc71; font-size: 1.5em; margin-top: 15px; font-weight: bold;">Balance: <span id="modalSiteBalance">0</span> eGold</div>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <label style="color: #FFB800; font-size: 1.2em; display: block; margin-bottom: 10px;">Deposit Amount (eGold)</label>
                    <input type="number" id="depositAmount" value="100" min="1" step="1" style="width: 100%; padding: 15px; font-size: 1.3em; border-radius: 10px; border: 2px solid #FFB800; background: rgba(0,0,0,0.5); color: white; text-align: center;">
                </div>
                
                <div style="display: flex; gap: 15px; justify-content: center;">
                    <button onclick="phantomWallet.executeDeposit()" style="flex: 1; padding: 18px; font-size: 1.3em; background: linear-gradient(135deg, #2ecc71, #27ae60); border: none; border-radius: 10px; color: white; cursor: pointer; font-weight: bold;">
                        💸 Deposit Now
                    </button>
                    <button onclick="phantomWallet.closeDepositModal()" style="flex: 1; padding: 18px; font-size: 1.3em; background: linear-gradient(135deg, #e74c3c, #c0392b); border: none; border-radius: 10px; color: white; cursor: pointer; font-weight: bold;">
                        ❌ Cancel
                    </button>
                </div>
                
                <p style="color: #888; font-size: 0.9em; margin-top: 20px;">
                    <i class="fas fa-info-circle"></i> Your casino wallet is automatically created and stored securely in your browser.
                    You can withdraw anytime!
                </p>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Update modal balance
        this.getSiteWalletBalance().then(bal => {
            const balEl = document.getElementById('modalSiteBalance');
            if (balEl) balEl.textContent = bal.toFixed(2);
        });
    }
    
    async executeDeposit() {
        const amount = parseFloat(document.getElementById('depositAmount').value);
        if (isNaN(amount) || amount <= 0) {
            alert('Please enter a valid amount!');
            return;
        }
        
        const success = await this.deposit(amount);
        if (success) {
            this.closeDepositModal();
        }
    }
    
    closeDepositModal() {
        const modal = document.getElementById('depositModal');
        if (modal) modal.remove();
    }
    
    // Show withdrawal modal
    showWithdrawModal() {
        const modal = document.createElement('div');
        modal.id = 'withdrawModal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;
        
        modal.innerHTML = `
            <div style="background: linear-gradient(135deg, #1a2a6c, #0f1f3d); padding: 40px; border-radius: 20px; border: 3px solid #FFB800; max-width: 600px; text-align: center; box-shadow: 0 20px 60px rgba(0,0,0,0.5);">
                <h2 style="color: #FFB800; font-size: 2.5em; margin-bottom: 20px;">💸 Withdraw eGold</h2>
                <p style="color: #ccc; font-size: 1.2em; margin-bottom: 30px;">Transfer your winnings to your Phantom wallet!</p>
                
                <div style="background: rgba(255,184,0,0.1); padding: 20px; border-radius: 10px; margin-bottom: 30px; border: 2px solid #FFB800;">
                    <div style="color: #888; font-size: 0.9em; margin-bottom: 10px;">Available Balance</div>
                    <div style="color: #2ecc71; font-size: 2em; font-weight: bold;"><span id="modalWithdrawBalance">0</span> eGold</div>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <label style="color: #FFB800; font-size: 1.2em; display: block; margin-bottom: 10px;">Withdraw Amount (eGold)</label>
                    <input type="number" id="withdrawAmount" value="10" min="1" step="1" style="width: 100%; padding: 15px; font-size: 1.3em; border-radius: 10px; border: 2px solid #FFB800; background: rgba(0,0,0,0.5); color: white; text-align: center;">
                    <button onclick="document.getElementById('withdrawAmount').value = document.getElementById('modalWithdrawBalance').textContent" style="margin-top: 10px; padding: 8px 15px; background: rgba(255,184,0,0.2); border: 1px solid #FFB800; border-radius: 5px; color: #FFB800; cursor: pointer;">
                        Withdraw All
                    </button>
                </div>
                
                <div style="display: flex; gap: 15px; justify-content: center;">
                    <button onclick="phantomWallet.executeWithdraw()" style="flex: 1; padding: 18px; font-size: 1.3em; background: linear-gradient(135deg, #FFB800, #FF8C00); border: none; border-radius: 10px; color: #0a1929; cursor: pointer; font-weight: bold;">
                        💰 Withdraw Now
                    </button>
                    <button onclick="phantomWallet.closeWithdrawModal()" style="flex: 1; padding: 18px; font-size: 1.3em; background: linear-gradient(135deg, #e74c3c, #c0392b); border: none; border-radius: 10px; color: white; cursor: pointer; font-weight: bold;">
                        ❌ Cancel
                    </button>
                </div>
                
                <p style="color: #888; font-size: 0.9em; margin-top: 20px;">
                    <i class="fas fa-info-circle"></i> Tokens will be sent to your connected Phantom wallet.
                </p>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Update modal balance
        this.getSiteWalletBalance().then(bal => {
            const balEl = document.getElementById('modalWithdrawBalance');
            if (balEl) balEl.textContent = bal.toFixed(2);
        });
    }
    
    async executeWithdraw() {
        const amount = parseFloat(document.getElementById('withdrawAmount').value);
        if (isNaN(amount) || amount <= 0) {
            alert('Please enter a valid amount!');
            return;
        }
        
        const success = await this.withdraw(amount);
        if (success) {
            this.closeWithdrawModal();
        }
    }
    
    closeWithdrawModal() {
        const modal = document.getElementById('withdrawModal');
        if (modal) modal.remove();
    }

    // Update UI with wallet info
    updateUI() {
        const walletBtn = document.getElementById('walletConnectBtn');
        const syncBtn = document.getElementById('syncBalanceBtn');
        const depositBtn = document.getElementById('depositBtn');
        const withdrawBtn = document.getElementById('withdrawBtn');
        const walletInfo = document.getElementById('walletInfo');
        
        if (this.connected && this.publicKey) {
            const shortKey = this.publicKey.slice(0, 4) + '...' + this.publicKey.slice(-4);
            
            if (walletBtn) {
                walletBtn.innerHTML = `<i class="fas fa-wallet"></i> ${shortKey}`;
                walletBtn.style.background = 'linear-gradient(135deg, #2ecc71, #27ae60)';
            }
            
            if (syncBtn) {
                syncBtn.style.display = 'inline-block';
            }
            
            if (depositBtn) {
                depositBtn.style.display = 'inline-block';
            }
            
            if (withdrawBtn) {
                withdrawBtn.style.display = 'inline-block';
            }
            
            if (walletInfo) {
                walletInfo.innerHTML = `
                    <div style="padding: 15px; background: rgba(46, 204, 113, 0.1); border-radius: 10px; margin: 10px 0;">
                        <strong>✅ Connected</strong><br>
                        <span style="font-size: 0.9rem; color: #a0a0b0;">${this.publicKey}</span><br>
                        <span style="font-size: 0.8rem; color: #FFB800;">eGold Token: ${this.eGoldMint}</span><br>
                        <span style="font-size: 0.8rem; color: #2ecc71;">Casino Wallet: ${this.siteWallet ? this.siteWallet.publicKey.toString() : 'Loading...'}</span><br>
                        <button onclick="phantomWallet.disconnect()" style="margin-top: 10px; padding: 8px 15px; background: #e74c3c; border: none; border-radius: 5px; color: white; cursor: pointer;">
                            Disconnect
                        </button>
                    </div>
                `;
            }
        } else {
            if (walletBtn) {
                walletBtn.innerHTML = '<i class="fas fa-wallet"></i> Connect Wallet';
                walletBtn.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
            }
            
            if (syncBtn) {
                syncBtn.style.display = 'none';
            }
            
            if (depositBtn) {
                depositBtn.style.display = 'none';
            }
            
            if (withdrawBtn) {
                withdrawBtn.style.display = 'none';
            }
            
            if (walletInfo) {
                walletInfo.innerHTML = `
                    <div style="padding: 15px; background: rgba(231, 76, 60, 0.1); border-radius: 10px; margin: 10px 0;">
                        <strong>❌ Not Connected</strong><br>
                        <span style="font-size: 0.9rem; color: #a0a0b0;">Connect your Phantom wallet to use real eGold tokens</span><br>
                        <span style="font-size: 0.8rem; color: #888; margin-top: 5px; display: block;">Token Mint: mntzrj9TrAmybpqz7WovMsY4mWFVdUCQQD6WhmeN1TL</span>
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
                    this.connection = new window.solanaWeb3.Connection(
                        'https://mainnet.helius-rpc.com/?api-key=8bc73df4-6f6b-441d-953c-335e77d0d0d7'
                    );
                    
                    // Sync balance
                    await this.syncBalance();
                    
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

// Export the class globally
window.PhantomWallet = PhantomWallet;
