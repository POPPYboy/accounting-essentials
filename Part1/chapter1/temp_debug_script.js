
        // ==================== Business Day Simulator ====================
        
        // Helper function to update status
        function updateStatus(msg, color, borderColor) {
            const statusEl = document.getElementById('js-status');
            if (statusEl) {
                statusEl.innerHTML = msg;
                if (color) statusEl.style.background = color;
                if (borderColor) statusEl.style.borderColor = borderColor;
            }
        }
        
        // Global error handler
        window.onerror = function(msg, url, line, col, error) {
            console.error('[GLOBAL ERROR]', msg, 'at line', line, 'col', col);
            updateStatus('🔴 JavaScript Error: ' + msg + ' (Line: ' + line + ')', '#f8d7da', '#dc3545');
            return false;
        };
        
        console.log('[DEBUG] Script started executing');
        
        // Mark as loaded
        updateStatus('🟢 JavaScript loaded successfully!', '#d4edda', '#28a745');
        
        let assets = 50000;
        let liabilities = 20000;
        let equity = 30000;
        let transactions = [
            {
                id: 1,
                desc: "Owner invested additional cash in business",
                type: "investment",
                accounts: ["Cash", "Owner's Equity"],
                directions: ["increase", "increase"],
                amounts: { assets: 15000, liabilities: 0, equity: 15000 },
                hint: "Investment increases both Cash (asset) and Owner's Equity"
            },
            {
                id: 2,
                desc: "Purchased office equipment, paid $8,000 cash",
                type: "purchase",
                accounts: ["Equipment", "Cash"],
                directions: ["increase", "decrease"],
                amounts: { assets: 0, liabilities: 0, equity: 0 },
                detail: "Equipment +$8,000, Cash -$8,000 (Net: $0)",
                hint: "Asset exchange: one asset increases, another decreases"
            },
            {
                id: 3,
                desc: "Purchased supplies on account $5,000",
                type: "purchase-credit",
                accounts: ["Supplies", "Accounts Payable"],
                directions: ["increase", "increase"],
                amounts: { assets: 5000, liabilities: 5000, equity: 0 },
                hint: "Purchasing on credit increases both Supplies (asset) and Accounts Payable (liability)"
            },
            {
                id: 4,
                desc: "Provided services to client, received $12,000 cash",
                type: "revenue",
                accounts: ["Cash", "Service Revenue"],
                directions: ["increase", "increase"],
                amounts: { assets: 12000, liabilities: 0, equity: 12000 },
                hint: "Services for cash increases Cash (asset) and creates Revenue (increases equity)"
            },
            {
                id: 5,
                desc: "Paid $3,000 rent for January",
                type: "expense",
                accounts: ["Rent Expense"],
                directions: ["decrease"],
                amounts: { assets: -3000, liabilities: 0, equity: -3000 },
                hint: "Expenses decrease Cash (asset) and decrease Owner's Equity"
            },
            {
                id: 6,
                desc: "Paid $2,000 of the supplies purchase on account",
                type: "payment",
                accounts: ["Accounts Payable"],
                directions: ["decrease"],
                amounts: { assets: 0, liabilities: -2000, equity: 0 },
                hint: "Paying accounts payable reduces the liability"
            },
            {
                id: 7,
                desc: "Owner withdrew $5,000 for personal use",
                type: "withdrawal",
                accounts: ["Cash", "Owner's Equity"],
                directions: ["decrease", "decrease"],
                amounts: { assets: -5000, liabilities: 0, equity: -5000 },
                hint: "Withdrawals decrease both Cash (asset) and Owner's Equity"
            },
            {
                id: 8,
                desc: "Received $6,000 payment for services already billed",
                type: "revenue",
                accounts: ["Cash", "Accounts Receivable"],
                directions: ["increase", "decrease"],
                amounts: { assets: 0, liabilities: 0, equity: 6000 },
                detail: "Cash +$6,000, Accounts Receivable -$6,000 (Net: $0)",
                hint: "Payment reduces receivable, increases cash, equity increases from revenue"
            }
        ];

        let completedTransactions = [];
        let selectedTransaction = null;
        const maxAssets = 100000;

        function init() {
            console.log('[DEBUG] init() called');
            console.log('[DEBUG] Transactions:', transactions.length);
            console.log('[DEBUG] Completed:', completedTransactions);

            try {
                // Don't re-render the list - it's already in HTML
                // Just update the progress counters
                updateProgress();
                updateEquationBars();
                console.log('[DEBUG] Initialization complete');
                
                // Update status
                document.getElementById('js-status').innerHTML = '🟢 JavaScript loaded & initialized! Transactions: ' + transactions.length;
            } catch (error) {
                console.error('[ERROR] Initialization failed:', error);
                document.getElementById('js-status').innerHTML = '🔴 Init Error: ' + error.message;
                document.getElementById('js-status').style.background = '#f8d7da';
            }
        }

        function renderTransactionQueue() {
            console.log('[DEBUG] renderTransactionQueue() called');
            
            // Update all transaction items based on completion status
            transactions.forEach((tx) => {
                const item = document.querySelector(`.transaction-item[data-id="${tx.id}"]`);
                if (item) {
                    const isCompleted = completedTransactions.includes(tx.id);
                    if (isCompleted) {
                        item.classList.add('completed');
                        item.removeAttribute('onclick');
                    } else {
                        item.classList.remove('completed');
                        item.setAttribute('onclick', `selectTransaction(${tx.id})`);
                    }
                }
            });

            document.getElementById('total-count').textContent = transactions.length;
            document.getElementById('completed-count').textContent = completedTransactions.length;
        }

        function selectTransaction(txId) {
            console.log('[CLICK] selectTransaction called with:', txId);
            
            try {
                // If txId is a number, find the transaction object
                if (typeof txId === 'number') {
                    selectedTransaction = transactions.find(t => t.id === txId);
                    console.log('[DEBUG] Found transaction:', selectedTransaction);
                } else {
                    selectedTransaction = txId;
                }
                
                if (!selectedTransaction) {
                    console.error('[ERROR] Transaction not found:', txId);
                    alert('Transaction not found: ' + txId);
                    return;
                }
                
                const tx = selectedTransaction;
                
                // Remove active class from all items
                document.querySelectorAll('.transaction-item').forEach(item => {
                    item.classList.remove('active');
                });

                // Add active class to selected
                const selectedElement = document.querySelector(`.transaction-item[data-id="${tx.id}"]`);
                if (selectedElement) {
                    selectedElement.classList.add('active');
                    console.log('[DEBUG] Added active class to element');
                }

                // Show detail panel
                const detailPanel = document.getElementById('transaction-detail');
                detailPanel.style.display = 'block';
                console.log('[DEBUG] Detail panel displayed');

                // Populate detail
                document.getElementById('detail-title').textContent = `Transaction #${tx.id}`;
                document.getElementById('detail-hint').textContent = tx.hint;

                // Build accounts affected display
                const accountsDiv = document.getElementById('accounts-affected');
                accountsDiv.innerHTML = tx.accounts.map((acct, idx) => {
                    const color = idx === 0 ? 'var(--primary)' : (idx === 1 ? 'var(--error)' : 'var(--success)');
                    return `<span style="background: ${color}; color: white; padding: 0.5rem 0.75rem; border-radius: var(--radius-sm); font-weight: 600;">${acct}</span>`;
                }).join(' ');

                // Build direction display
                const directionDiv = document.getElementById('direction-affected');
                directionDiv.innerHTML = tx.directions.map((dir, idx) => {
                    const color = dir === 'increase' ? 'var(--success)' : 'var(--error)';
                    const icon = dir === 'increase' ? '↑' : '↓';
                    return `<span style="background: ${color}; color: white; padding: 0.5rem 0.75rem; border-radius: var(--radius-sm); font-weight: 600;">${icon} ${dir}</span>`;
                }).join(' ');

                // Show impact amounts
                document.getElementById('impact-assets').textContent = formatAmount(tx.amounts.assets);
                document.getElementById('impact-liabilities').textContent = formatAmount(tx.amounts.liabilities);
                document.getElementById('impact-equity').textContent = formatAmount(tx.amounts.equity);
                
                console.log('[DEBUG] Transaction detail populated successfully');
            } catch (error) {
                console.error('[ERROR] in selectTransaction:', error);
                alert('Error: ' + error.message);
            }
        }

        function formatAmount(amount) {
            return amount >= 0 ? `+ $${amount.toLocaleString()}` : `- $${Math.abs(amount).toLocaleString()}`;
        }

        function closeDetail() {
            selectedTransaction = null;
            document.getElementById('transaction-detail').style.display = 'none';
            document.querySelectorAll('.transaction-item').forEach(item => {
                item.classList.remove('active');
            });
        }

        function processTransaction() {
            if (!selectedTransaction) return;

            const tx = selectedTransaction;

            // Update equation
            assets += tx.amounts.assets;
            liabilities += tx.amounts.liabilities;
            equity += tx.amounts.equity;

            // Ensure values don't go negative for display
            assets = Math.max(0, assets);
            liabilities = Math.max(0, liabilities);
            equity = Math.max(0, equity);

            // Mark as completed
            completedTransactions.push(tx.id);

            // Update displays
            updateEquationBars();
            updateProgress();
            renderTransactionQueue();
            renderHistory();

            // Close detail panel
            closeDetail();

            // Check if all done
            if (completedTransactions.length === transactions.length) {
                showCompletionBadge();
            }
        }

        function skipTransaction() {
            if (!selectedTransaction) return;

            // Mark as skipped without updating equation
            completedTransactions.push(selectedTransaction.id);

            // Update displays
            updateProgress();
            renderTransactionQueue();
            renderHistory();

            // Close detail panel
            closeDetail();
        }

        function updateEquationBars() {
            const maxPercent = Math.max(assets, liabilities, equity) / maxAssets * 100;
            const minHeight = 20;

            document.getElementById('assets-bar').style.height = Math.max(maxPercent, minHeight) + '%';
            document.getElementById('liabilities-bar').style.height = Math.max((liabilities / maxAssets) * 100, minHeight) + '%';
            document.getElementById('equity-bar').style.height = Math.max((equity / maxAssets) * 100, minHeight) + '%';

            document.getElementById('assets-value').textContent = '$' + assets.toLocaleString();
            document.getElementById('liabilities-value').textContent = '$' + liabilities.toLocaleString();
            document.getElementById('equity-value').textContent = '$' + equity.toLocaleString();

            // Check balance
            const status = document.getElementById('balance-status');
            const isBalanced = Math.abs(assets - (liabilities + equity)) < 0.01;

            if (isBalanced) {
                status.textContent = '✓ Equation Balanced';
                status.style.background = 'var(--success)';
            } else {
                status.textContent = '✗ Unbalanced';
                status.style.background = 'var(--error)';
            }

            // Add animation
            document.querySelector('.equation-bars-container').classList.add('animate-update');
            setTimeout(() => {
                document.querySelector('.equation-bars-container').classList.remove('animate-update');
            }, 500);
        }

        function updateProgress() {
            const percent = (completedTransactions.length / transactions.length) * 100;
            document.getElementById('progress-fill').style.width = percent + '%';
        }

        function renderHistory() {
            const tbody = document.getElementById('history-body');
            tbody.innerHTML = '';

            let runningAssets = assets;
            let runningLiabilities = liabilities;
            let runningEquity = equity;

            transactions.forEach((tx, index) => {
                if (!completedTransactions.includes(tx.id)) return;

                const row = document.createElement('tr');
                const isCompleted = completedTransactions.includes(tx.id);
                const impactClass = tx.amounts.assets >= 0 ? 'impact-positive' : 'impact-negative';

                row.innerHTML = `
                    <td>${isCompleted ? tx.id : '<span style="color: var(--text-muted);">' + (index + 1) + '</span>' + '}</td>
                    <td>${isCompleted ? tx.desc : tx.desc.substring(0, 40) + '...'}</td>
                    <td class="${impactClass}">${isCompleted ? formatAmount(tx.amounts.assets) : ''}</td>
                    <td class="${impactClass}">${isCompleted ? formatAmount(tx.amounts.liabilities) : ''}</td>
                    <td class="${impactClass}">${isCompleted ? formatAmount(tx.amounts.equity) : ''}</td>
                    <td style="font-weight: 700; color: var(--primary);">${isCompleted ? '$' + (tx.amounts.assets + runningAssets).toLocaleString() : ''}</td>
                `;

                tbody.appendChild(row);

                if (isCompleted) {
                    runningAssets = tx.amounts.assets + runningAssets;
                    runningLiabilities = tx.amounts.liabilities + runningLiabilities;
                    runningEquity = tx.amounts.equity + runningEquity;
                }
            });

            // Show final balance
            if (completedTransactions.length > 0) {
                const finalRow = document.createElement('tr');
                finalRow.style.background = 'var(--bg-light)';
                finalRow.innerHTML = `
                    <td colspan="5" style="text-align: right; font-weight: 700; padding: 1rem;">
                        Final Balance: Assets $${runningAssets.toLocaleString()} = Liabilities $${runningLiabilities.toLocaleString()} + Equity $${runningEquity.toLocaleString()}
                    </td>
                `;
                tbody.appendChild(finalRow);
            }
        }

        function showCompletionBadge() {
            const badge = document.createElement('div');
            badge.className = 'success-badge';
            badge.innerHTML = `
                <h3 style="margin: 0 0 0.5rem;">🎉 Business Day Complete!</h3>
                <p style="margin: 0;">You've successfully processed all transactions and maintained the accounting equation balance.</p>
                <p style="margin-top: 0.5rem; font-size: 0.9rem;">Excellent work!</p>
            `;
            document.body.appendChild(badge);

            setTimeout(() => {
                badge.remove();
            }, 4000);
        }

        function resetSimulator() {
            assets = 50000;
            liabilities = 20000;
            equity = 30000;
            completedTransactions = [];
            selectedTransaction = null;

            document.getElementById('transaction-detail').style.display = 'none';

            updateEquationBars();
            updateProgress();
            renderTransactionQueue();
            renderHistory();

            document.getElementById('feedback-message').classList.remove('show');
        }

        // Test function to verify JavaScript is working
        function testClick() {
            console.log('[TEST] testClick function executed');
            alert('JavaScript is working! Click handlers are active.');
            return true;
        }

        // Initialize on page load
        console.log('[DEBUG] Script loaded, setting up DOMContentLoaded listener');
        document.addEventListener('DOMContentLoaded', () => {
            console.log('[DEBUG] DOM content loaded, calling init()');
            
            // Update status to show main script is working
            const statusEl = document.getElementById('js-status');
            if (statusEl) {
                statusEl.innerHTML = '🟢 Main script initialized! Transactions: ' + transactions.length;
                statusEl.style.background = '#d4edda';
                statusEl.style.borderColor = '#28a745';
            }
            
            init();
            
            // Verify all transaction items are clickable
            const items = document.querySelectorAll('.transaction-item');
            console.log('[DEBUG] Found transaction items:', items.length);
            items.forEach((item, idx) => {
                const onclick = item.getAttribute('onclick');
                console.log(`[DEBUG] Item ${idx + 1} onclick:`, onclick);
            });
        });
