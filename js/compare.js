// Card Comparison Tool Logic

const compareCardsData = [
    {
        id: 'hdfc-infinia',
        name: 'HDFC Infinia Metal',
        bank: 'HDFC Bank',
        fee: '₹12,500',
        feeWaiver: 'None',
        type: 'Premium',
        bestFor: 'Travel, Luxury',
        rewardRate: '3.3% - 16%',
        onlineReward: 'Up to 16%',
        travelReward: '16% (SmartBuy)',
        diningReward: '3.3%',
        billReward: '1.6%',
        lounge: 'Unlimited Global',
        
        forex: '2%',
        minIncome: '₹30L/year',
        approval: 'Difficult',
        applyLink: "https://www.hdfcbank.com/personal/pay/cards/credit-cards/infinia-credit-card",
        pros: ['Highest reward potential', 'Unlimited lounges', '16% on travel'],
        cons: ['High annual fee', 'Difficult approval', 'Complex redemption']
    },
    {
        id: 'sbi-cashback',
        name: 'SBI Cashback Card',
        bank: 'SBI Card',
        fee: '₹999',
        feeWaiver: 'None',
        type: 'Cashback',
        bestFor: 'Online Shopping',
        rewardRate: '1% - 5%',
        onlineReward: '5%',
        travelReward: '1%',
        diningReward: '1%',
        billReward: '1%',
        lounge: 'None',
        forex: '3.5%',
        minIncome: '₹3L/year',
        approval: 'Easy',
        applyLink: "https://www.sbicard.com/en/personal/credit-cards/rewards/cashback-sbi-card.page",
        pros: ['Simple 5% cashback', 'Low fee', 'Wide acceptance'],
        cons: ['No lounge access', 'Monthly caps', 'High forex markup']
    },
    {
        id: 'axis-atlas',
        name: 'Axis Atlas',
        bank: 'Axis Bank',
        fee: '₹5,000',
        feeWaiver: 'Spend ₹3L',
        type: 'Travel',
        bestFor: 'Frequent Flyers',
        rewardRate: '2% - 10%',
        onlineReward: '2%',
        travelReward: '10%',
        diningReward: '2%',
        billReward: '2%',
        lounge: 'International + Domestic',
        forex: '2%',
        minIncome: '₹6L/year',
        approval: 'Moderate',
        applyLink: "https://www.axisbank.com/retail/cards/credit-card/axis-bank-atlas-credit-card",
        pros: ['Best airmiles', '10+ partners', 'Good lounge access'],
        cons: ['Annual fee', 'Complex points', 'Approval time']
    },
    {
        id: 'amazon-pay-icici',
        name: 'Amazon Pay ICICI',
        bank: 'ICICI Bank',
        fee: 'Lifetime Free',
        feeWaiver: 'N/A',
        type: 'Beginner',
        bestFor: 'Amazon Shoppers',
        rewardRate: '1% - 5%',
        onlineReward: '5% (Amazon)',
        travelReward: '1%',
        diningReward: '2%',
        billReward: '2%',
        lounge: 'None',
        forex: '3.5%',
        minIncome: '₹2.5L/year',
        approval: 'Very Easy',
        applyLink: "https://www.icicibank.com/personal-banking/cards/credit-card/amazon-pay-credit-card",
        pros: ['Lifetime free', 'Easy approval', 'Prime benefits'],
        cons: ['Limited to Amazon', 'No lounge', 'Lower base rewards']
    },
    {
        id: 'axis-ace',
        name: 'Axis Ace',
        bank: 'Axis Bank',
        fee: '₹499',
        feeWaiver: 'None',
        type: 'Bills',
        bestFor: 'Bill Payments',
        rewardRate: '1% - 5%',
        onlineReward: '2%',
        travelReward: '1%',
        diningReward: '4%',
        billReward: '5%',
        lounge: 'None',
        forex: '3.5%',
        minIncome: '₹3L/year',
        approval: 'Easy',
        applyLink: "https://www.axisbank.com/retail/cards/credit-card/axis-bank-ace-credit-card",
        pros: ['5% on bills', 'Low fee', 'Google Pay integration'],
        cons: ['Monthly cap ₹500', 'No lounge', 'Limited partners']
    },
    {
        id: 'hdfc-millennia',
        name: 'HDFC Millennia',
        bank: 'HDFC Bank',
        fee: '₹1,000',
        feeWaiver: 'Spend ₹30K',
        type: 'Millennial',
        bestFor: 'Young Professionals',
        rewardRate: '1% - 5%',
        onlineReward: '5%',
        travelReward: '5%',
        diningReward: '5%',
        billReward: '1%',
        lounge: 'None',
        forex: '3.5%',
        minIncome: '₹3L/year',
        approval: 'Moderate',
        applyLink: "https://www.hdfcbank.com/personal/pay/cards/credit-cards/millennia-credit-card",
        pros: ['5% on popular sites', 'Low fee', 'Good for beginners'],
        cons: ['Monthly caps', 'Points expire', 'No lounge']
    },
    {
        id: 'idfc-first-wealth',
        name: 'IDFC First Wealth',
        bank: 'IDFC Bank',
        fee: 'Lifetime Free',
        feeWaiver: 'N/A',
        type: 'Premium LTF',
        bestFor: 'High Spenders',
        rewardRate: '2.5% - 3.75%',
        onlineReward: '2.5%',
        travelReward: '2.5%',
        diningReward: '2.5%',
        billReward: '2.5%',
        lounge: 'Domestic + International',
        forex: '1.5%',
        minIncome: '₹3L/year',
        approval: 'Moderate',
        applyLink: "https://www.idfcfirstbank.com/credit-card/wealth-credit-card",
        pros: ['Lifetime free', 'Flat 2.5% rewards', 'Low forex markup'],
        cons: ['Newer bank', 'Limited acceptance', 'No bonus categories']
    },
    {
        id: 'flipkart-axis',
        name: 'Flipkart Axis',
        bank: 'Axis Bank',
        fee: '₹500',
        feeWaiver: 'None',
        type: 'Shopping',
        bestFor: 'Flipkart Users',
        rewardRate: '1% - 5%',
        onlineReward: '5% (Flipkart)',
        travelReward: '4% (Cleartrip)',
        diningReward: '4%',
        billReward: '1%',
        lounge: 'None',
        forex: '3.5%',
        minIncome: '₹2.5L/year',
        approval: 'Easy',
        applyLink: "https://www.axisbank.com/retail/cards/credit-card/flipkart-axis-bank-credit-card",
        pros: ['5% Flipkart cashback', '4% Myntra', 'Low fee'],
        cons: ['Flipkart focused', 'No lounge', 'Caps apply']
    }
];

let selectedCards = [];

function initComparison() {
    renderCardSelector();
    
    // Check URL params for pre-selected cards
    const urlParams = new URLSearchParams(window.location.search);
    const cardsParam = urlParams.get('cards');
    if (cardsParam) {
        const cardIds = cardsParam.split(',');
        cardIds.forEach(id => {
            const card = compareCardsData.find(c => c.id === id);
            if (card) selectedCards.push(card);
        });
        if (selectedCards.length >= 2) {
            updateComparison();
        }
    }
}

function renderCardSelector() {
    const container = document.getElementById('cardSelector');
    container.innerHTML = compareCardsData.map(card => `
        <div class="selector-card ${selectedCards.find(c => c.id === card.id) ? 'selected' : ''}" 
             onclick="toggleCard('${card.id}')" 
             data-id="${card.id}">
            <div class="selector-card-visual ${getCardTheme(card.type)}"></div>
            <h4>${card.name}</h4>
            <p>${card.bank}</p>
            <span class="selector-fee">${card.fee}</span>
        </div>
    `).join('');
}

function getCardTheme(type) {
    const themes = {
        'Premium': 'premium',
        'Cashback': 'cashback',
        'Travel': 'travel',
        'Beginner': 'beginner',
        'Bills': 'bills',
        'Millennial': 'beginner',
        'Premium LTF': 'ltf',
        'Shopping': 'cashback'
    };
    return themes[type] || 'default';
}

function toggleCard(cardId) {
    const card = compareCardsData.find(c => c.id === cardId);
    const index = selectedCards.findIndex(c => c.id === cardId);
    
    if (index > -1) {
        selectedCards.splice(index, 1);
    } else {
        if (selectedCards.length >= 4) {
            showToast('Maximum 4 cards can be compared');
            return;
        }
        selectedCards.push(card);
    }
    
    renderCardSelector();
    updatePreview();
    
    document.getElementById('compareBtn').disabled = selectedCards.length < 2;
}

function updatePreview() {
    const chips = document.getElementById('previewChips');
    if (selectedCards.length === 0) {
        chips.innerHTML = '<span class="empty-chip">No cards selected</span>';
    } else {
        chips.innerHTML = selectedCards.map(c => `
            <span class="selected-chip">
                ${c.name}
                <button onclick="event.stopPropagation(); toggleCard('${c.id}')">×</button>
            </span>
        `).join('');
    }
}

function updateComparison() {
    if (selectedCards.length < 2) {
        showToast('Select at least 2 cards');
        return;
    }
    
    document.getElementById('emptyState').style.display = 'none';
    document.getElementById('comparisonDisplay').classList.add('active');
    
    renderTable();
    renderMobileView();
    determineWinner();
    
    // Scroll to results
    document.getElementById('comparisonDisplay').scrollIntoView({ behavior: 'smooth' });
}

function renderTable() {
    const thead = document.getElementById('tableHeader');
    const tbody = document.getElementById('tableBody');
    
    // Header
    thead.innerHTML = '<th>Feature</th>' + selectedCards.map(c => `
        <th>
            <div class="table-card-header">
                <span class="table-card-name">${c.name}</span>
                <span class="table-card-bank">${c.bank}</span>
            </div>
        </th>
    `).join('');
    
    // Rows
    const rows = [
        { label: 'Annual Fee', key: 'fee', highlight: 'low' },
        { label: 'Fee Waiver', key: 'feeWaiver' },
        { label: 'Card Type', key: 'type' },
        { label: 'Best For', key: 'bestFor' },
        { label: 'Overall Reward Rate', key: 'rewardRate', highlight: 'high' },
        { label: 'Online Shopping', key: 'onlineReward', highlight: 'high' },
        { label: 'Travel', key: 'travelReward', highlight: 'high' },
        { label: 'Dining', key: 'diningReward', highlight: 'high' },
        { label: 'Bill Payments', key: 'billReward', highlight: 'high' },
        { label: 'Lounge Access', key: 'lounge' },
        { label: 'Forex Markup', key: 'forex', highlight: 'low' },
        { label: 'Min. Income Required', key: 'minIncome' },
        { label: 'Approval Difficulty', key: 'approval' }
    ];
    
    tbody.innerHTML = rows.map(row => `
        <tr>
            <td class="feature-label">${row.label}</td>
            ${selectedCards.map(card => {
                let value = card[row.key];
                let cellClass = '';
                
                if (row.highlight === 'high' && value.includes('%')) {
                    const num = parseFloat(value);
                    const max = Math.max(...selectedCards.map(c => parseFloat(c[row.key]) || 0));
                    if (num === max) cellClass = 'highlight-best';
                }
                
                if (row.highlight === 'low' && row.key === 'fee') {
                    if (value === 'Lifetime Free') cellClass = 'highlight-best';
                }
                
                return `<td class="${cellClass}">${value}</td>`;
            }).join('')}
        </tr>
    `).join('') + renderProsConsRows();
}

function renderProsConsRows() {
    let html = '<tr class="section-divider"><td colspan="' + (selectedCards.length + 1) + '">Pros & Cons</td></tr>';
    
    // Pros
    html += '<tr><td class="feature-label pros-label">Pros</td>' + 
        selectedCards.map(card => `
            <td class="pros-cell">
                <ul>${card.pros.map(p => `<li>${p}</li>`).join('')}</ul>
            </td>
        `).join('') + 
    '</tr>';
    
    // Cons
    html += '<tr><td class="feature-label cons-label">Cons</td>' + 
        selectedCards.map(card => `
            <td class="cons-cell">
                <ul>${card.cons.map(c => `<li>${c}</li>`).join('')}</ul>
            </td>
        `).join('') + 
    '</tr>';
    
    return html;
}

function renderMobileView() {
    const container = document.getElementById('mobileComparison');
    container.innerHTML = selectedCards.map(card => `
        <div class="mobile-card-compare">
            <div class="mobile-card-header">
                <h3>${card.name}</h3>
                <span class="mobile-card-bank">${card.bank}</span>
            </div>
            <div class="mobile-card-fee">${card.fee}</div>
            
            <div class="mobile-compare-section">
                <h4>Rewards</h4>
                <div class="mobile-compare-row">
                    <span>Online</span>
                    <strong>${card.onlineReward}</strong>
                </div>
                <div class="mobile-compare-row">
                    <span>Travel</span>
                    <strong>${card.travelReward}</strong>
                </div>
                <div class="mobile-compare-row">
                    <span>Dining</span>
                    <strong>${card.diningReward}</strong>
                </div>
                <div class="mobile-compare-row">
                    <span>Bills</span>
                    <strong>${card.billReward}</strong>
                </div>
            </div>
            
            <div class="mobile-compare-section">
                <h4>Benefits</h4>
                <div class="mobile-compare-row">
                    <span>Lounge</span>
                    <strong>${card.lounge}</strong>
                </div>
                <div class="mobile-compare-row">
                    <span>Forex</span>
                    <strong>${card.forex}</strong>
                </div>
            </div>
            
            <div class="mobile-compare-section">
                <h4>Eligibility</h4>
                <div class="mobile-compare-row">
                    <span>Min Income</span>
                    <strong>${card.minIncome}</strong>
                </div>
                <div class="mobile-compare-row">
                    <span>Approval</span>
                    <strong>${card.approval}</strong>
                </div>
            </div>
            
            <a href="${card.applyLink}" target="_blank" class="btn-primary btn-full apply-link">
                Apply Now
            </a>
        </div>
    `).join('');
}

function determineWinner() {
    // Simple scoring algorithm
    let winner = selectedCards[0];
    let maxScore = 0;
    
    selectedCards.forEach(card => {
        let score = 0;
        
        // Reward rates (parse percentages)
        const avgReward = parseFloat(card.rewardRate) || 0;
        score += avgReward * 10;
        
        // Fee (lower is better)
        if (card.fee === 'Lifetime Free') score += 50;
        else if (card.fee.includes('999')) score += 30;
        else if (card.fee.includes('499')) score += 35;
        else score += 10;
        
        // Lounge access
        if (card.lounge.includes('Unlimited')) score += 30;
        else if (card.lounge.includes('International')) score += 20;
        else if (card.lounge !== 'None') score += 10;
        
        // Forex
        const forex = parseFloat(card.forex) || 3.5;
        score += (4 - forex) * 10;
        
        if (score > maxScore) {
            maxScore = score;
            winner = card;
        }
    });
    
    document.getElementById('winnerBanner').style.display = 'block';
    document.getElementById('winnerName').textContent = winner.name;
    
    // Update the Apply button to link to winner's apply link
    const winnerBtn = document.getElementById('winnerApplyBtn');
    if (winnerBtn) {
        winnerBtn.href = winner.applyLink;
    }
    
    // Generate reason
    let reason = '';
    if (winner.rewardRate.includes('16')) reason = 'Highest reward potential';
    else if (winner.fee === 'Lifetime Free') reason = 'Best value - lifetime free';
    else if (winner.type === 'Cashback') reason = 'Simple, high cashback';
    else reason = 'Best overall benefits';
    
    document.getElementById('winnerReason').textContent = reason;
}

function clearComparison() {
    selectedCards = [];
    renderCardSelector();
    updatePreview();
    document.getElementById('compareBtn').disabled = true;
    document.getElementById('comparisonDisplay').classList.remove('active');
    document.getElementById('emptyState').style.display = 'block';
    document.getElementById('winnerBanner').style.display = 'none';
}

// Toast function
function showToast(message) {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    } else {
        alert(message);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', initComparison);