// Admin System - Account Management
class AdminSystem {
    constructor() {
        this.isAdmin = false;
        this.adminPassword = 'EGOLD_ADMIN_2026'; // Change this!
        this.adminWallet = 'ADMIN_WALLET_ADDRESS_HERE'; // Your admin wallet
        this.bannedAccounts = JSON.parse(localStorage.getItem('bannedAccounts') || '[]');
        this.accountDatabase = JSON.parse(localStorage.getItem('accountDatabase') || '[]');
        this.setupKeybind();
    }
    
    setupKeybind() {
        document.addEventListener('keydown', (e) => {
            // Ctrl + Shift + A opens admin panel
            if (e.ctrlKey && e.shiftKey && e.key === 'A') {
                e.preventDefault();
                this.showAdminPanel();
            }
        });
    }
    
    async authenticate() {
        const password = prompt('Enter Admin Password:');
        if (password === this.adminPassword) {
            this.isAdmin = true;
            return true;
        }
        alert('❌ Invalid admin password!');
        return false;
    }
    
    async showAdminPanel() {
        if (!this.isAdmin) {
            const authenticated = await this.authenticate();
            if (!authenticated) return;
        }
        
        // Collect all account data
        await this.scanAccounts();
        
        const modal = document.createElement('div');
        modal.id = 'adminPanel';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.95);
            z-index: 99999;
            overflow-y: auto;
            padding: 20px;
        `;
        
        modal.innerHTML = `
            <div style="max-width: 1400px; margin: 0 auto; background: linear-gradient(135deg, #1a1a2e, #16213e); border-radius: 20px; border: 3px solid #e74c3c; padding: 30px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; border-bottom: 2px solid #e74c3c; padding-bottom: 20px;">
                    <h1 style="color: #e74c3c; font-size: 2.5em; margin: 0;">
                        <i class="fas fa-user-shield"></i> ADMIN CONTROL PANEL
                    </h1>
                    <button onclick="adminSystem.closeAdminPanel()" style="padding: 10px 20px; background: #e74c3c; border: none; border-radius: 8px; color: white; cursor: pointer; font-size: 1.1em;">
                        <i class="fas fa-times"></i> Close
                    </button>
                </div>
                
                <!-- Stats Overview -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 30px;">
                    <div style="background: rgba(46,204,113,0.1); padding: 20px; border-radius: 10px; border: 2px solid #2ecc71;">
                        <div style="color: #888; font-size: 0.9em;">Total Accounts</div>
                        <div style="color: #2ecc71; font-size: 2em; font-weight: bold;" id="totalAccounts">0</div>
                    </div>
                    <div style="background: rgba(231,76,60,0.1); padding: 20px; border-radius: 10px; border: 2px solid #e74c3c;">
                        <div style="color: #888; font-size: 0.9em;">Banned Accounts</div>
                        <div style="color: #e74c3c; font-size: 2em; font-weight: bold;" id="bannedCount">${this.bannedAccounts.length}</div>
                    </div>
                    <div style="background: rgba(255,184,0,0.1); padding: 20px; border-radius: 10px; border: 2px solid #FFB800;">
                        <div style="color: #888; font-size: 0.9em;">Total eGold in System</div>
                        <div style="color: #FFB800; font-size: 2em; font-weight: bold;" id="totalEgold">0</div>
                    </div>
                    <div style="background: rgba(52,152,219,0.1); padding: 20px; border-radius: 10px; border: 2px solid #3498db;">
                        <div style="color: #888; font-size: 0.9em;">Active Sessions</div>
                        <div style="color: #3498db; font-size: 2em; font-weight: bold;" id="activeSessions">1</div>
                    </div>
                </div>
                
                <!-- Actions Bar -->
                <div style="background: rgba(0,0,0,0.3); padding: 20px; border-radius: 10px; margin-bottom: 20px; display: flex; gap: 15px; flex-wrap: wrap;">
                    <button onclick="adminSystem.refreshAccounts()" style="padding: 12px 25px; background: linear-gradient(135deg, #3498db, #2980b9); border: none; border-radius: 8px; color: white; cursor: pointer; font-weight: bold;">
                        <i class="fas fa-sync"></i> Refresh Data
                    </button>
                    <button onclick="adminSystem.banAll()" style="padding: 12px 25px; background: linear-gradient(135deg, #e74c3c, #c0392b); border: none; border-radius: 8px; color: white; cursor: pointer; font-weight: bold;">
                        <i class="fas fa-ban"></i> Ban All
                    </button>
                    <button onclick="adminSystem.unbanAll()" style="padding: 12px 25px; background: linear-gradient(135deg, #2ecc71, #27ae60); border: none; border-radius: 8px; color: white; cursor: pointer; font-weight: bold;">
                        <i class="fas fa-check"></i> Unban All
                    </button>
                    <button onclick="adminSystem.seizeAll()" style="padding: 12px 25px; background: linear-gradient(135deg, #f39c12, #e67e22); border: none; border-radius: 8px; color: white; cursor: pointer; font-weight: bold;">
                        <i class="fas fa-hand-holding-usd"></i> Seize All Funds
                    </button>
                    <button onclick="adminSystem.exportData()" style="padding: 12px 25px; background: linear-gradient(135deg, #9b59b6, #8e44ad); border: none; border-radius: 8px; color: white; cursor: pointer; font-weight: bold;">
                        <i class="fas fa-download"></i> Export CSV
                    </button>
                </div>
                
                <!-- Search Bar -->
                <div style="margin-bottom: 20px;">
                    <input type="text" id="adminSearch" placeholder="Search by wallet address, IP, or session..." style="width: 100%; padding: 15px; background: rgba(0,0,0,0.5); border: 2px solid #666; border-radius: 8px; color: white; font-size: 1.1em;">
                </div>
                
                <!-- Accounts Table -->
                <div style="background: rgba(0,0,0,0.3); border-radius: 10px; overflow: hidden;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="background: rgba(231,76,60,0.2);">
                                <th style="padding: 15px; text-align: left; color: #FFB800; border-bottom: 2px solid #e74c3c;">Status</th>
                                <th style="padding: 15px; text-align: left; color: #FFB800; border-bottom: 2px solid #e74c3c;">Casino Wallet</th>
                                <th style="padding: 15px; text-align: left; color: #FFB800; border-bottom: 2px solid #e74c3c;">Phantom Wallet</th>
                                <th style="padding: 15px; text-align: left; color: #FFB800; border-bottom: 2px solid #e74c3c;">Balance</th>
                                <th style="padding: 15px; text-align: left; color: #FFB800; border-bottom: 2px solid #e74c3c;">Last Active</th>
                                <th style="padding: 15px; text-align: left; color: #FFB800; border-bottom: 2px solid #e74c3c;">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="accountsTableBody">
                            <tr>
                                <td colspan="6" style="padding: 40px; text-align: center; color: #888;">
                                    <i class="fas fa-spinner fa-spin"></i> Loading accounts...
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
                <!-- Admin Settings -->
                <div style="margin-top: 30px; padding: 20px; background: rgba(231,76,60,0.1); border-radius: 10px; border: 2px solid #e74c3c;">
                    <h3 style="color: #e74c3c; margin-bottom: 15px;"><i class="fas fa-cog"></i> Admin Settings</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                        <div>
                            <label style="color: #ccc; display: block; margin-bottom: 5px;">Admin Wallet Address:</label>
                            <input type="text" id="adminWalletInput" value="${this.adminWallet}" style="width: 100%; padding: 10px; background: rgba(0,0,0,0.5); border: 1px solid #666; border-radius: 5px; color: white; font-family: monospace;">
                        </div>
                        <div>
                            <label style="color: #ccc; display: block; margin-bottom: 5px;">Admin Password:</label>
                            <input type="password" id="adminPasswordInput" value="${this.adminPassword}" style="width: 100%; padding: 10px; background: rgba(0,0,0,0.5); border: 1px solid #666; border-radius: 5px; color: white;">
                        </div>
                    </div>
                    <button onclick="adminSystem.saveSettings()" style="margin-top: 15px; padding: 10px 25px; background: #2ecc71; border: none; border-radius: 5px; color: white; cursor: pointer; font-weight: bold;">
                        <i class="fas fa-save"></i> Save Settings
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Load account data
        await this.loadAccountsTable();
        
        // Setup search
        document.getElementById('adminSearch').addEventListener('input', (e) => {
            this.filterAccounts(e.target.value);
        });
    }
    
    async scanAccounts() {
        // Scan for all site wallets in localStorage
        const accounts = [];
        
        // Current session
        if (phantomWallet && phantomWallet.siteWallet) {
            const balance = await phantomWallet.getSiteWalletBalance();
            accounts.push({
                siteWallet: phantomWallet.siteWallet.publicKey.toString(),
                phantomWallet: phantomWallet.publicKey || 'Not Connected',
                balance: balance,
                lastActive: new Date().toISOString(),
                sessionId: this.generateSessionId(),
                isCurrent: true
            });
        }
        
        // Load from database
        const storedAccounts = JSON.parse(localStorage.getItem('accountDatabase') || '[]');
        accounts.push(...storedAccounts);
        
        this.accountDatabase = accounts;
        localStorage.setItem('accountDatabase', JSON.stringify(accounts));
        
        return accounts;
    }
    
    async loadAccountsTable() {
        const tbody = document.getElementById('accountsTableBody');
        const accounts = this.accountDatabase;
        
        if (accounts.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="padding: 40px; text-align: center; color: #888;">
                        No accounts found. Accounts will appear as users connect.
                    </td>
                </tr>
            `;
            return;
        }
        
        let totalBalance = 0;
        
        tbody.innerHTML = accounts.map(account => {
            const isBanned = this.bannedAccounts.includes(account.siteWallet);
            totalBalance += account.balance || 0;
            
            return `
                <tr style="border-bottom: 1px solid #333; ${account.isCurrent ? 'background: rgba(52,152,219,0.1);' : ''}">
                    <td style="padding: 15px;">
                        ${isBanned ? 
                            '<span style="color: #e74c3c; font-weight: bold;"><i class="fas fa-ban"></i> BANNED</span>' : 
                            '<span style="color: #2ecc71;"><i class="fas fa-check-circle"></i> Active</span>'}
                        ${account.isCurrent ? '<br><span style="color: #3498db; font-size: 0.8em;"><i class="fas fa-user"></i> Current Session</span>' : ''}
                    </td>
                    <td style="padding: 15px;">
                        <div style="font-family: monospace; color: #FFB800; font-size: 0.85em;">${account.siteWallet}</div>
                        <button onclick="navigator.clipboard.writeText('${account.siteWallet}')" style="margin-top: 5px; padding: 3px 8px; background: rgba(255,184,0,0.2); border: 1px solid #FFB800; border-radius: 3px; color: #FFB800; cursor: pointer; font-size: 0.8em;">
                            <i class="fas fa-copy"></i> Copy
                        </button>
                    </td>
                    <td style="padding: 15px;">
                        <div style="font-family: monospace; color: #9b59b6; font-size: 0.85em;">${account.phantomWallet}</div>
                    </td>
                    <td style="padding: 15px;">
                        <div style="color: #2ecc71; font-size: 1.2em; font-weight: bold;">${(account.balance || 0).toFixed(2)} eGold</div>
                        <div style="color: #888; font-size: 0.8em;">$${((account.balance || 0) * 0.1).toFixed(2)} USD</div>
                    </td>
                    <td style="padding: 15px;">
                        <div style="color: #ccc;">${new Date(account.lastActive).toLocaleString()}</div>
                        <div style="color: #888; font-size: 0.8em;">${account.sessionId || 'N/A'}</div>
                    </td>
                    <td style="padding: 15px;">
                        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                            ${!isBanned ? 
                                `<button onclick="adminSystem.banAccount('${account.siteWallet}')" style="padding: 6px 12px; background: #e74c3c; border: none; border-radius: 5px; color: white; cursor: pointer; font-size: 0.85em;">
                                    <i class="fas fa-ban"></i> Ban
                                </button>` :
                                `<button onclick="adminSystem.unbanAccount('${account.siteWallet}')" style="padding: 6px 12px; background: #2ecc71; border: none; border-radius: 5px; color: white; cursor: pointer; font-size: 0.85em;">
                                    <i class="fas fa-check"></i> Unban
                                </button>`
                            }
                            <button onclick="adminSystem.seizeAccount('${account.siteWallet}')" style="padding: 6px 12px; background: #f39c12; border: none; border-radius: 5px; color: white; cursor: pointer; font-size: 0.85em;">
                                <i class="fas fa-hand-holding-usd"></i> Seize
                            </button>
                            <button onclick="adminSystem.viewDetails('${account.siteWallet}')" style="padding: 6px 12px; background: #3498db; border: none; border-radius: 5px; color: white; cursor: pointer; font-size: 0.85em;">
                                <i class="fas fa-info-circle"></i> Details
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
        
        // Update stats
        document.getElementById('totalAccounts').textContent = accounts.length;
        document.getElementById('totalEgold').textContent = totalBalance.toFixed(2);
    }
    
    banAccount(walletAddress) {
        if (confirm(`Are you sure you want to BAN this account?\n\n${walletAddress}`)) {
            if (!this.bannedAccounts.includes(walletAddress)) {
                this.bannedAccounts.push(walletAddress);
                localStorage.setItem('bannedAccounts', JSON.stringify(this.bannedAccounts));
                
                // Check if current user
                if (phantomWallet && phantomWallet.siteWallet && 
                    phantomWallet.siteWallet.publicKey.toString() === walletAddress) {
                    alert('⚠️ You just banned the current session! User will be blocked.');
                    this.blockCurrentSession();
                }
                
                this.loadAccountsTable();
            }
        }
    }
    
    unbanAccount(walletAddress) {
        const index = this.bannedAccounts.indexOf(walletAddress);
        if (index > -1) {
            this.bannedAccounts.splice(index, 1);
            localStorage.setItem('bannedAccounts', JSON.stringify(this.bannedAccounts));
            this.loadAccountsTable();
        }
    }
    
    async seizeAccount(walletAddress) {
        const account = this.accountDatabase.find(a => a.siteWallet === walletAddress);
        if (!account) {
            alert('Account not found!');
            return;
        }
        
        if (account.balance <= 0) {
            alert('No balance to seize!');
            return;
        }
        
        if (!confirm(`SEIZE ${account.balance.toFixed(2)} eGold from this account?\n\n${walletAddress}\n\nThis will transfer all funds to the admin wallet.`)) {
            return;
        }
        
        try {
            // In a real implementation, this would transfer tokens
            alert(`⚠️ SEIZURE INITIATED\n\nAmount: ${account.balance.toFixed(2)} eGold\nFrom: ${walletAddress}\nTo: ${this.adminWallet}\n\n(Transaction system not fully implemented in demo)`);
            
            // Update balance to 0
            account.balance = 0;
            localStorage.setItem('accountDatabase', JSON.stringify(this.accountDatabase));
            
            this.loadAccountsTable();
        } catch (err) {
            alert('Seizure failed: ' + err.message);
        }
    }
    
    banAll() {
        if (confirm('BAN ALL ACCOUNTS? This will ban every account in the system!')) {
            this.accountDatabase.forEach(account => {
                if (!this.bannedAccounts.includes(account.siteWallet)) {
                    this.bannedAccounts.push(account.siteWallet);
                }
            });
            localStorage.setItem('bannedAccounts', JSON.stringify(this.bannedAccounts));
            this.loadAccountsTable();
        }
    }
    
    unbanAll() {
        if (confirm('UNBAN ALL ACCOUNTS? This will remove all bans.')) {
            this.bannedAccounts = [];
            localStorage.setItem('bannedAccounts', JSON.stringify(this.bannedAccounts));
            this.loadAccountsTable();
        }
    }
    
    async seizeAll() {
        if (!confirm('SEIZE ALL FUNDS? This will confiscate all eGold from all accounts!')) {
            return;
        }
        
        let totalSeized = 0;
        this.accountDatabase.forEach(account => {
            totalSeized += account.balance || 0;
            account.balance = 0;
        });
        
        localStorage.setItem('accountDatabase', JSON.stringify(this.accountDatabase));
        
        alert(`💰 SEIZED ${totalSeized.toFixed(2)} eGold from ${this.accountDatabase.length} accounts!\n\n(Transaction system not fully implemented in demo)`);
        
        this.loadAccountsTable();
    }
    
    async refreshAccounts() {
        await this.scanAccounts();
        await this.loadAccountsTable();
    }
    
    filterAccounts(query) {
        const rows = document.querySelectorAll('#accountsTableBody tr');
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(query.toLowerCase()) ? '' : 'none';
        });
    }
    
    viewDetails(walletAddress) {
        const account = this.accountDatabase.find(a => a.siteWallet === walletAddress);
        if (!account) return;
        
        alert(`ACCOUNT DETAILS\n\n` +
              `Casino Wallet: ${account.siteWallet}\n` +
              `Phantom Wallet: ${account.phantomWallet}\n` +
              `Balance: ${(account.balance || 0).toFixed(2)} eGold\n` +
              `Last Active: ${new Date(account.lastActive).toLocaleString()}\n` +
              `Session ID: ${account.sessionId || 'N/A'}\n` +
              `Status: ${this.bannedAccounts.includes(account.siteWallet) ? 'BANNED' : 'Active'}`);
    }
    
    exportData() {
        let csv = 'Status,Casino Wallet,Phantom Wallet,Balance,Last Active,Session ID\n';
        this.accountDatabase.forEach(account => {
            const status = this.bannedAccounts.includes(account.siteWallet) ? 'BANNED' : 'Active';
            csv += `${status},${account.siteWallet},${account.phantomWallet},${account.balance || 0},${account.lastActive},${account.sessionId || 'N/A'}\n`;
        });
        
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `casino-accounts-${Date.now()}.csv`;
        a.click();
    }
    
    saveSettings() {
        this.adminWallet = document.getElementById('adminWalletInput').value;
        this.adminPassword = document.getElementById('adminPasswordInput').value;
        localStorage.setItem('adminWallet', this.adminWallet);
        localStorage.setItem('adminPassword', this.adminPassword);
        alert('✅ Admin settings saved!');
    }
    
    blockCurrentSession() {
        // Show banned screen
        document.body.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 100vh; background: #000;">
                <div style="text-align: center;">
                    <div style="font-size: 8em; color: #e74c3c; margin-bottom: 20px;">
                        <i class="fas fa-ban"></i>
                    </div>
                    <h1 style="color: #e74c3c; font-size: 3em; margin-bottom: 20px;">ACCOUNT BANNED</h1>
                    <p style="color: #ccc; font-size: 1.5em;">This account has been suspended by the administrator.</p>
                    <p style="color: #888; margin-top: 20px;">Contact support for more information.</p>
                </div>
            </div>
        `;
    }
    
    generateSessionId() {
        return 'SES-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }
    
    closeAdminPanel() {
        const panel = document.getElementById('adminPanel');
        if (panel) panel.remove();
    }
    
    // Check if current user is banned
    checkBanStatus() {
        if (phantomWallet && phantomWallet.siteWallet) {
            const walletAddress = phantomWallet.siteWallet.publicKey.toString();
            if (this.bannedAccounts.includes(walletAddress)) {
                this.blockCurrentSession();
                return true;
            }
        }
        return false;
    }
}

// Initialize admin system
const adminSystem = new AdminSystem();
window.adminSystem = adminSystem;

// Check ban status periodically
setInterval(() => {
    adminSystem.checkBanStatus();
}, 5000);
