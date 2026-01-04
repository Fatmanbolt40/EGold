// Solana Wallet Integration
// This is a placeholder for future Solana integration

class SolanaBettingSystem {
    constructor() {
        this.connected = false;
        this.walletAddress = null;
        this.publicKey = null;
    }

    // Connect to Phantom or Solflare wallet
    async connectWallet() {
        try {
            // Check if Phantom wallet is available
            if (window.solana && window.solana.isPhantom) {
                const response = await window.solana.connect();
                this.walletAddress = response.publicKey.toString();
                this.publicKey = response.publicKey;
                this.connected = true;
                console.log('Connected to wallet:', this.walletAddress);
                return true;
            } else {
                alert('Please install Phantom wallet or another Solana wallet!');
                return false;
            }
        } catch (error) {
            console.error('Error connecting to wallet:', error);
            return false;
        }
    }

    // Disconnect wallet
    async disconnectWallet() {
        if (window.solana) {
            await window.solana.disconnect();
            this.connected = false;
            this.walletAddress = null;
            this.publicKey = null;
        }
    }

    // Deposit eGold (placeholder for actual blockchain transaction)
    async deposit(amount) {
        if (!this.connected) {
            alert('Please connect your wallet first!');
            return false;
        }

        try {
            // In production, this would create an actual Solana transaction
            console.log(`Depositing ${amount} eGold from ${this.walletAddress}`);
            
            // Simulate transaction delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Update local balance
            updateBalance(amount);
            
            alert(`Successfully deposited ${amount} eGold!`);
            return true;
        } catch (error) {
            console.error('Deposit failed:', error);
            alert('Deposit failed. Please try again.');
            return false;
        }
    }

    // Withdraw eGold (placeholder for actual blockchain transaction)
    async withdraw(amount) {
        if (!this.connected) {
            alert('Please connect your wallet first!');
            return false;
        }

        if (currentBalance < amount) {
            alert('Insufficient balance!');
            return false;
        }

        try {
            // In production, this would create an actual Solana transaction
            console.log(`Withdrawing ${amount} eGold to ${this.walletAddress}`);
            
            // Simulate transaction delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Update local balance
            updateBalance(-amount);
            
            alert(`Successfully withdrew ${amount} eGold!`);
            return true;
        } catch (error) {
            console.error('Withdrawal failed:', error);
            alert('Withdrawal failed. Please try again.');
            return false;
        }
    }

    // Place bet (record on blockchain in production)
    async placeBet(gameId, amount, betData) {
        if (!this.connected) {
            console.log('Wallet not connected, using local balance');
        }

        const betRecord = {
            gameId: gameId,
            amount: amount,
            timestamp: Date.now(),
            walletAddress: this.walletAddress || 'local',
            betData: betData
        };

        // In production, this would be recorded on Solana blockchain
        console.log('Bet placed:', betRecord);
        return betRecord;
    }

    // Get wallet balance (from blockchain in production)
    async getWalletBalance() {
        if (!this.connected) {
            return 0;
        }

        try {
            // In production, query actual Solana balance
            // const balance = await connection.getBalance(this.publicKey);
            // return balance / LAMPORTS_PER_SOL;
            
            return currentBalance; // Local balance for now
        } catch (error) {
            console.error('Error getting balance:', error);
            return 0;
        }
    }
}

// Initialize betting system
const bettingSystem = new SolanaBettingSystem();

// Wallet modal functionality
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('walletModal');
    const depositBtn = document.getElementById('depositBtn');
    const withdrawBtn = document.getElementById('withdrawBtn');
    const closeBtn = document.querySelector('.close');
    const confirmBtn = document.getElementById('confirmTransaction');
    const modalTitle = document.getElementById('modalTitle');
    let currentAction = null;

    depositBtn.addEventListener('click', function() {
        currentAction = 'deposit';
        modalTitle.textContent = 'Deposit eGold';
        modal.style.display = 'block';
    });

    withdrawBtn.addEventListener('click', function() {
        currentAction = 'withdraw';
        modalTitle.textContent = 'Withdraw eGold';
        modal.style.display = 'block';
    });

    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
        clearForm();
    });

    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            clearForm();
        }
    });

    confirmBtn.addEventListener('click', async function() {
        const amount = parseFloat(document.getElementById('amount').value);
        const walletAddress = document.getElementById('walletAddress').value;

        if (!amount || amount <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        if (!walletAddress && !bettingSystem.connected) {
            // Try to connect wallet
            const connected = await bettingSystem.connectWallet();
            if (!connected) {
                alert('Please enter a valid Solana wallet address or connect your wallet');
                return;
            }
        }

        confirmBtn.disabled = true;
        confirmBtn.textContent = 'Processing...';

        if (currentAction === 'deposit') {
            await bettingSystem.deposit(amount);
        } else if (currentAction === 'withdraw') {
            await bettingSystem.withdraw(amount);
        }

        confirmBtn.disabled = false;
        confirmBtn.textContent = 'Confirm';
        modal.style.display = 'none';
        clearForm();
    });

    function clearForm() {
        document.getElementById('amount').value = '';
        document.getElementById('walletAddress').value = '';
    }
});
