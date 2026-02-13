// Main JavaScript for CardMax - Backend Integration

const API_BASE_URL = 'http://localhost:8000';

// ============================================
// UTILITY FUNCTIONS
// ============================================

function scrollToSection(id) {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

function showToast(message) {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.textContent = message;
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(-50%) translateY(0)';
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-50%) translateY(100px)';
        }, 3000);
    }
}

function formatCurrency(amount) {
    if (amount === 0 || amount === undefined || amount === null) return '₹0';
    return '₹' + Math.round(amount).toLocaleString('en-IN');
}

// ============================================
// DEMO FUNCTIONALITY (for index.html)
// ============================================

let demoInterval = null;

function startDemo() {
    const uploadState = document.getElementById('uploadState');
    const analyzingState = document.getElementById('analyzingState');
    const resultsState = document.getElementById('resultsState');
    const progressBar = document.getElementById('demoProgress');
    const steps = document.querySelectorAll('.demo-step');
    
    if (!uploadState || !analyzingState) return;
    
    uploadState.classList.remove('active');
    analyzingState.classList.add('active');
    
    steps[0].classList.remove('active');
    steps[0].classList.add('completed');
    steps[1].classList.add('active');
    
    let progress = 0;
    demoInterval = setInterval(() => {
        progress += 5;
        if (progressBar) progressBar.style.width = progress + '%';
        
        if (progress === 30) {
            steps[1].classList.remove('active');
            steps[1].classList.add('completed');
            steps[2].classList.add('active');
        }
        
        if (progress >= 100) {
            clearInterval(demoInterval);
            setTimeout(() => {
                steps[2].classList.remove('active');
                steps[2].classList.add('completed');
                steps[3].classList.add('active');
                analyzingState.classList.remove('active');
                if (resultsState) resultsState.classList.add('active');
            }, 500);
        }
    }, 100);
}

function showDashboard() {
    const dashboard = document.getElementById('demoDashboard');
    if (dashboard) {
        dashboard.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        animateValue('dashTotal', 0, 245000, 1000, '₹');
        animateValue('dashMissed', 0, 24500, 1000, '₹');
        animateValue('dashTxns', 0, 47, 1000, '');
        
        setTimeout(() => animatePieChart(), 500);
        setTimeout(() => animateBarChart(), 800);
    }
}

function closeDashboard() {
    const dashboard = document.getElementById('demoDashboard');
    if (dashboard) {
        dashboard.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function animateValue(id, start, end, duration, prefix = '') {
    const obj = document.getElementById(id);
    if (!obj) return;
    
    if (obj.classList.contains('animating')) return;
    obj.classList.add('animating');
    
    const range = end - start;
    const stepTime = Math.max(Math.floor(duration / Math.abs(range || 1)), 50);
    let startTime = new Date().getTime();
    let endTime = startTime + duration;
    
    function run() {
        let now = new Date().getTime();
        let remaining = Math.max((endTime - now) / duration, 0);
        let value = Math.round(end - (remaining * range));
        
        obj.textContent = prefix + value.toLocaleString('en-IN');
        
        if (value == end) {
            clearInterval(timer);
            obj.classList.remove('animating');
        }
    }
    
    let timer = setInterval(run, stepTime);
    run();
}

function animatePieChart() {
    const segments = [
        { id: 'pieSegment1', value: 84, delay: 0 },
        { id: 'pieSegment2', value: 60, delay: 200 },
        { id: 'pieSegment3', value: 48, delay: 400 },
        { id: 'pieSegment4', value: 48, delay: 600 }
    ];
    
    const total = 238.76;
    
    segments.forEach(seg => {
        setTimeout(() => {
            const element = document.getElementById(seg.id);
            if (element) {
                element.style.strokeDasharray = `${seg.value} ${total}`;
            }
        }, seg.delay);
    });
    
    setTimeout(() => {
        const centerValue = document.getElementById('pieCenterValue');
        if (centerValue) {
            animateValue('pieCenterValue', 0, 245000, 800, '₹');
        }
    }, 800);
}

function animateBarChart() {
    const bars = [
        { fill: 'barFill1', val: 'barVal1', height: 60, value: 185000 },
        { fill: 'barFill2', val: 'barVal2', height: 85, value: 245000 },
        { fill: 'barFill3', val: 'barVal3', height: 45, value: 142000 },
        { fill: 'barFill4', val: 'barVal4', height: 70, value: 198000 },
        { fill: 'barFill5', val: 'barVal5', height: 55, value: 168000 },
        { fill: 'barFill6', val: 'barVal6', height: 90, value: 245000 }
    ];
    
    bars.forEach((bar, index) => {
        setTimeout(() => {
            const fillEl = document.getElementById(bar.fill);
            if (fillEl) {
                fillEl.style.height = bar.height + '%';
            }
            animateValue(bar.val, 0, bar.value, 600, '₹');
        }, index * 100);
    });
}

function highlightSegment(index) {
    const segments = document.querySelectorAll('.pie-chart-segment');
    const tooltip = document.getElementById('segmentTooltip');
    
    segments.forEach((seg, i) => {
        seg.style.opacity = i === index ? '1' : '0.3';
        seg.style.filter = i === index ? 'brightness(1.2)' : '';
    });
    
    if (tooltip && segments[index]) {
        const data = segments[index].dataset;
        tooltip.innerHTML = `<strong>${data.label}</strong><br>${data.value} (${data.amount})`;
        tooltip.style.opacity = '1';
    }
}

function resetSegment() {
    const segments = document.querySelectorAll('.pie-chart-segment');
    const tooltip = document.getElementById('segmentTooltip');
    
    segments.forEach(seg => {
        seg.style.opacity = '1';
        seg.style.filter = '';
    });
    
    if (tooltip) tooltip.style.opacity = '0';
}

// ============================================
// CARD STACK & EXPLORER
// ============================================

let currentCardIndex = 0;

const cardDatabase = [
    {
        id: 'hdfc_infinia',
        name: 'HDFC Infinia Metal',
        bank: 'HDFC Bank',
        type: 'Premium Travel',
        fee: '₹12,500/year',
        rewards: [
            { category: 'Travel', rate: '3.3%' },
            { category: 'Hotels', rate: '3.3%' },
            { category: 'All spends', rate: '3.3%' }
        ]
    },
    {
        id: 'sbi_cashback',
        name: 'SBI Cashback Card',
        bank: 'SBI Card',
        type: 'Cashback',
        fee: '₹999/year',
        rewards: [
            { category: 'Online spends', rate: '5%' },
            { category: 'Other spends', rate: '1%' }
        ]
    },
    {
        id: 'axis_ace',
        name: 'Axis ACE Credit Card',
        bank: 'Axis Bank',
        type: 'Bill Payments',
        fee: '₹499/year',
        rewards: [
            { category: 'Utility bills', rate: '4%' },
            { category: 'Food delivery', rate: '4%' },
            { category: 'Other spends', rate: '2%' }
        ]
    },
    {
        id: 'icici_amazon_pay',
        name: 'ICICI Amazon Pay',
        bank: 'ICICI Bank',
        type: 'Shopping',
        fee: '₹0/year',
        rewards: [
            { category: 'Amazon spends', rate: '5%' },
            { category: 'Other spends', rate: '1%' }
        ]
    },
    {
        id: 'hdfc_millennia',
        name: 'HDFC Millennia',
        bank: 'HDFC Bank',
        type: 'Lifestyle',
        fee: '₹1,000/year',
        rewards: [
            { category: 'Shopping', rate: '5%' },
            { category: 'Dining', rate: '5%' },
            { category: 'Other spends', rate: '1%' }
        ]
    }
];

function rotateStack(index) {
    currentCardIndex = index;
    const items = document.querySelectorAll('.featured-item');
    
    items.forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });
}

function openCardModal(card) {
    const modal = document.getElementById('cardModal');
    if (!modal || !card) return;
    
    document.getElementById('modalBank').textContent = card.bank || 'Bank';
    document.getElementById('modalTitle').textContent = card.name || 'Card Name';
    document.getElementById('modalType').textContent = card.type || 'Type';
    document.getElementById('modalFee').textContent = card.fee || 'Fee';
    
    const rewardsList = document.getElementById('modalRewards');
    if (rewardsList && card.rewards) {
        rewardsList.innerHTML = card.rewards.map(r => `
            <div class="reward-item">
                <span>${r.category}</span>
                <span class="reward-rate">${r.rate}</span>
            </div>
        `).join('');
    }
    
    modal.classList.add('active');
}

function closeCardModal(event) {
    if (event && event.target !== event.currentTarget && !event.target.classList.contains('modal-close')) return;
    const modal = document.getElementById('cardModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function navigateCard(direction) {
    showToast('Card navigation');
}

function populateCards() {
    const track = document.getElementById('cardsTrack');
    if (!track) return;
    
    const banks = ['HDFC', 'SBI', 'ICICI', 'Axis', 'Amex', 'Citi'];
    const types = ['Premium', 'Cashback', 'Travel', 'Shopping'];
    
    let cardsHTML = '';
    for (let i = 0; i < 15; i++) {
        const bank = banks[i % banks.length];
        const type = types[i % types.length];
        cardsHTML += `
            <div class="explorer-card" onclick="openCardModal({
                name: '${bank} ${type} Card',
                bank: '${bank} Bank',
                type: '${type}',
                fee: '₹${(i % 5 + 1) * 500}/year',
                rewards: [
                    {category: 'Dining', rate: '${(i % 5 + 1)}%'},
                    {category: 'Shopping', rate: '${(i % 3 + 2)}%'}
                ]
            })">
                <div class="explorer-card-header">
                    <span>${bank}</span>
                    <div class="card-chip"></div>
                </div>
                <div class="explorer-card-type">${type}</div>
                <div class="explorer-card-footer">
                    <span>Tap for details</span>
                </div>
            </div>
        `;
    }
    track.innerHTML = cardsHTML;
}

function filterCards(filter) {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    if (event && event.target) {
        event.target.classList.add('active');
    }
    showToast(`Filtered by: ${filter}`);
}

function scrollCards(direction) {
    const container = document.querySelector('.cards-scroll-container');
    if (container) {
        container.scrollBy({
            left: direction === 'left' ? -300 : 300,
            behavior: 'smooth'
        });
    }
}

// ============================================
// CALCULATOR
// ============================================

function calculateLoss() {
    const online = parseFloat(document.getElementById('onlineSpend')?.value) || 0;
    const dining = parseFloat(document.getElementById('diningSpend')?.value) || 0;
    const travel = parseFloat(document.getElementById('travelSpend')?.value) || 0;
    const other = parseFloat(document.getElementById('otherSpend')?.value) || 0;
    
    const total = online + dining + travel + other;
    const loss = total * 0.02 * 12;
    
    const lossAmount = document.getElementById('lossAmount');
    if (lossAmount) {
        lossAmount.textContent = '₹' + Math.round(loss).toLocaleString('en-IN');
    }
    
    const resultBox = document.getElementById('resultBox');
    if (resultBox && total > 0) {
        resultBox.classList.add('active');
    }
}

function initScrollProgress() {
    const progressBar = document.getElementById('scrollProgress');
    const container = document.querySelector('.cards-scroll-container');
    
    if (container && progressBar) {
        container.addEventListener('scroll', () => {
            const scrollWidth = container.scrollWidth - container.clientWidth;
            const scrolled = (container.scrollLeft / scrollWidth) * 100;
            progressBar.style.width = scrolled + '%';
        });
    }
}

// ============================================
// CARD SELECTION & UPLOAD FLOW
// ============================================

let selectedCardId = null;

function initCardSelection() {
    const container = document.getElementById('cardSelectionContainer');
    if (!container) return;
    
    console.log('Initializing card selection...');
    
    // Create card selection UI
    let html = '<div class="card-selection-grid">';
    
    cardDatabase.forEach((card, index) => {
        html += `
            <div class="card-option" data-card-id="${card.id}" onclick="selectCard('${card.id}')">
                <div class="card-option-header">
                    <span class="card-option-bank">${card.bank}</span>
                    <div class="card-option-chip"></div>
                </div>
                <div class="card-option-name">${card.name}</div>
                <div class="card-option-type">${card.type}</div>
                <div class="card-option-fee">${card.fee}</div>
                <div class="card-option-check">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    html += `
        <div class="card-selection-actions">
            <button class="btn-primary" id="continueBtn" onclick="showUploadSection()" disabled>
                Continue
            </button>
        </div>
    `;
    
    container.innerHTML = html;
}

function selectCard(cardId) {
    selectedCardId = cardId;
    
    // Update UI
    document.querySelectorAll('.card-option').forEach(el => {
        el.classList.remove('selected');
    });
    
    const selected = document.querySelector(`[data-card-id="${cardId}"]`);
    if (selected) {
        selected.classList.add('selected');
    }
    
    // Enable continue button
    const continueBtn = document.getElementById('continueBtn');
    if (continueBtn) {
        continueBtn.disabled = false;
    }
    
    // Save to localStorage
    localStorage.setItem('cardmax_selected_card', cardId);
    
    console.log('Selected card:', cardId);
}

function showUploadSection() {
    if (!selectedCardId) {
        showToast('Please select a card first');
        return;
    }
    
    const cardSection = document.getElementById('cardSelectionSection');
    const uploadSection = document.getElementById('uploadSection');
    
    if (cardSection) {
        cardSection.style.display = 'none';
    }
    
    if (uploadSection) {
        uploadSection.style.display = 'block';
        uploadSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Initialize upload zone
    initFileUpload();
}

function initFileUpload() {
    const uploadZone = document.getElementById('uploadZone');
    
    if (!uploadZone) {
        console.log('Upload zone not found');
        return;
    }
    
    console.log('Initializing file upload...');
    
    // Create file input if not exists
    let fileInput = document.getElementById('fileInput');
    if (!fileInput) {
        fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.id = 'fileInput';
        fileInput.accept = '.csv,.xlsx,.xls,.pdf';
        fileInput.style.display = 'none';
        document.body.appendChild(fileInput);
    }
    
    // Drag and drop events
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadZone.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    ['dragenter', 'dragover'].forEach(eventName => {
        uploadZone.addEventListener(eventName, () => {
            uploadZone.classList.add('dragover');
        });
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        uploadZone.addEventListener(eventName, () => {
            uploadZone.classList.remove('dragover');
        });
    });
    
    uploadZone.addEventListener('drop', handleDrop);
    fileInput.addEventListener('change', handleFileSelect);
    
    uploadZone.addEventListener('click', () => {
        fileInput.click();
    });
}

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files.length) handleFile(files[0]);
}

function handleFileSelect(e) {
    const files = e.target.files;
    if (files.length) handleFile(files[0]);
}

async function handleFile(file) {
    console.log('Handling file:', file.name);
    
    const allowedTypes = ['.csv', '.xlsx', '.xls', '.pdf'];
    const fileExt = '.' + file.name.split('.').pop().toLowerCase();
    
    if (!allowedTypes.includes(fileExt)) {
        showToast('Invalid file type. Please upload CSV, Excel, or PDF.');
        return;
    }
    
    showUploadLoading(true);
    
    try {
        const formData = new FormData();
        formData.append('file', file);
        
        // Add selected card if available
        const selectedCard = localStorage.getItem('cardmax_selected_card');
        if (selectedCard) {
            formData.append('card_id', selectedCard);
        }
        
        console.log('Sending to:', `${API_BASE_URL}/api/analyze`);
        
        const response = await fetch(`${API_BASE_URL}/api/analyze`, {
            method: 'POST',
            body: formData
        });
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Upload failed: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Analysis result:', result);
        
        if (result.success) {
            // Store analysis data
            localStorage.setItem('cardmax_analysis', JSON.stringify(result.data));
            localStorage.setItem('cardmax_analysis_time', new Date().toISOString());
            
            showToast('Analysis complete! Loading dashboard...');
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'analyzer.html?view=dashboard';
            }, 500);
        } else {
            throw new Error(result.error || 'Analysis failed');
        }
        
    } catch (error) {
        console.error('Upload error:', error);
        showToast('Error: ' + error.message);
        showUploadLoading(false);
    }
}

function showUploadLoading(show) {
    const uploadZone = document.getElementById('uploadZone');
    if (!uploadZone) return;
    
    if (show) {
        uploadZone.innerHTML = `
            <div class="upload-loading">
                <div class="spinner"></div>
                <p>Analyzing your statement...</p>
                <p class="upload-subtitle">This may take a few seconds</p>
            </div>
        `;
        uploadZone.style.pointerEvents = 'none';
    } else {
        uploadZone.innerHTML = `
            <div class="upload-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
            </div>
            <p class="upload-text">Drop your statement here</p>
            <p class="upload-subtitle">or click to browse (CSV, Excel, PDF)</p>
        `;
        uploadZone.style.pointerEvents = 'auto';
    }
}

// ============================================
// DASHBOARD DATA LOADING
// ============================================

function loadDashboardData() {
    console.log('Loading dashboard data...');
    
    const data = localStorage.getItem('cardmax_analysis');
    
    if (!data) {
        console.log('No analysis data found');
        showNoDataState();
        return;
    }
    
    try {
        const analysis = JSON.parse(data);
        console.log('Analysis data loaded:', analysis);
        
        // Hide no data state
        const noDataState = document.querySelector('.no-data-state');
        if (noDataState) {
            noDataState.style.display = 'none';
        }
        
        // Show dashboard content
        const dashboardContent = document.querySelector('.dashboard-content');
        if (dashboardContent) {
            dashboardContent.style.display = 'block';
        }
        
        // Update all sections
        updateSummaryCards(analysis.totals);
        updateCategoryChart(analysis.category_totals);
        updateTransactionsTable(analysis.transactions);
        updateInsights(analysis.ai_insights);
        updateBestCards(analysis.best_cards);
        
    } catch (e) {
        console.error('Error loading analysis:', e);
        showToast('Error loading data. Please try uploading again.');
    }
}

function showNoDataState() {
    console.log('Showing no data state');
    // The HTML already shows this by default
}

function updateSummaryCards(totals) {
    if (!totals) return;
    
    console.log('Updating summary cards:', totals);
    
    const totalSpent = totals.total_spend || 0;
    const transactionCount = totals.transaction_count || 0;
    
    // Find top category
    const categoryBreakdown = totals.category_breakdown || {};
    let topCategory = '-';
    let topAmount = 0;
    
    Object.entries(categoryBreakdown).forEach(([cat, amount]) => {
        if (amount > topAmount && cat !== 'CASHBACK') {
            topAmount = amount;
            topCategory = cat.replace(/_/g, ' ');
        }
    });
    
    // Update elements
    const totalEl = document.getElementById('totalSpent');
    const txnsEl = document.getElementById('transactionCount');
    const topCatEl = document.getElementById('topCategory');
    
    if (totalEl) {
        totalEl.textContent = formatCurrency(totalSpent);
        totalEl.classList.add('animate-in');
    }
    
    if (txnsEl) {
        txnsEl.textContent = transactionCount + ' txn' + (transactionCount !== 1 ? 's' : '');
        txnsEl.classList.add('animate-in');
    }
    
    if (topCatEl) {
        topCatEl.textContent = topCategory.charAt(0).toUpperCase() + topCatEl.slice(1);
        topCatEl.classList.add('animate-in');
    }
}

function updateCategoryChart(categoryTotals) {
    const container = document.getElementById('categoryChart');
    if (!container || !categoryTotals) return;
    
    console.log('Updating category chart:', categoryTotals);
    
    // Filter and sort categories
    const filtered = Object.entries(categoryTotals)
        .filter(([cat, amount]) => amount > 100 && cat !== 'CASHBACK')
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6);
    
    if (filtered.length === 0) {
        container.innerHTML = '<p class="no-data">No category data available</p>';
        return;
    }
    
    const total = filtered.reduce((sum, [, amount]) => sum + amount, 0);
    const colors = ['#00d084', '#a855f7', '#fb923c', '#f472b6', '#ef4444', '#ec4899'];
    
    // Build pie chart
    let svgContent = '';
    let legendContent = '';
    let currentAngle = 0;
    
    filtered.forEach(([category, amount], i) => {
        const percentage = (amount / total) * 100;
        const angle = (amount / total) * 360;
        const color = colors[i % colors.length];
        
        const startAngle = currentAngle;
        const endAngle = currentAngle + angle;
        
        const x1 = 50 + 35 * Math.cos((startAngle - 90) * Math.PI / 180);
        const y1 = 50 + 35 * Math.sin((startAngle - 90) * Math.PI / 180);
        const x2 = 50 + 35 * Math.cos((endAngle - 90) * Math.PI / 180);
        const y2 = 50 + 35 * Math.sin((endAngle - 90) * Math.PI / 180);
        
        const largeArc = angle > 180 ? 1 : 0;
        const path = `M 50 50 L ${x1} ${y1} A 35 35 0 ${largeArc} 1 ${x2} ${y2} Z`;
        
        svgContent += `<path d="${path}" fill="${color}" stroke="white" stroke-width="2"/>`;
        
        legendContent += `
            <div class="legend-item">
                <div class="legend-color" style="background: ${color}"></div>
                <div class="legend-text">
                    <span class="legend-label">${category.replace(/_/g, ' ')}</span>
                    <span class="legend-percent">${percentage.toFixed(1)}% · ${formatCurrency(amount)}</span>
                </div>
            </div>
        `;
        
        currentAngle += angle;
    });
    
    container.innerHTML = `
        <div class="pie-chart-wrapper">
            <div class="pie-chart-container">
                <svg viewBox="0 0 100 100" class="pie-chart-svg" style="transform: rotate(-90deg);">
                    ${svgContent}
                    <circle cx="50" cy="50" r="25" fill="white"/>
                    <text x="50" y="48" text-anchor="middle" font-size="6" fill="#666">Total</text>
                    <text x="50" y="56" text-anchor="middle" font-size="8" font-weight="bold" fill="#333">${formatCurrency(total)}</text>
                </svg>
            </div>
            <div class="pie-legend">
                ${legendContent}
            </div>
        </div>
    `;
}

function updateTransactionsTable(transactions) {
    const tbody = document.getElementById('transactionsBody');
    if (!tbody || !transactions) return;
    
    console.log('Updating transactions table:', transactions.length);
    
    const sorted = transactions
        .filter(t => t.type === 'Debit')
        .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
        .slice(0, 10);
    
    if (sorted.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="no-data">No transactions found</td></tr>';
        return;
    }
    
    tbody.innerHTML = sorted.map(t => `
        <tr>
            <td>${t.date || '-'}</td>
            <td>${t.merchant || t.description || '-'}</td>
            <td><span class="category-badge ${(t.category || 'OTHER').toLowerCase()}">${(t.category || 'Other').replace(/_/g, ' ')}</span></td>
            <td class="amount">${formatCurrency(t.amount)}</td>
        </tr>
    `).join('');
}

function updateInsights(insights) {
    const container = document.getElementById('insightsContainer');
    if (!container || !insights) return;
    
    console.log('Updating insights:', insights.length);
    
    if (insights.length === 0) {
        container.innerHTML = '<p class="no-data">No insights available</p>';
        return;
    }
    
    container.innerHTML = insights.map(insight => `
        <div class="insight-card ${insight.type}">
            <div class="insight-icon">${insight.icon}</div>
            <div class="insight-content">
                <h4>${insight.title}</h4>
                <p>${insight.description}</p>
            </div>
        </div>
    `).join('');
}

function updateBestCards(bestCards) {
    const container = document.getElementById('bestCardsContainer');
    if (!container || !bestCards) return;
    
    console.log('Updating best cards:', bestCards.length);
    
    if (bestCards.length === 0) {
        container.innerHTML = '<p class="no-data">No recommendations available</p>';
        return;
    }
    
    container.innerHTML = bestCards.slice(0, 3).map((card, i) => `
        <div class="recommendation-card">
            <div class="rec-header">
                <span class="rec-rank">#${i + 1}</span>
                <span class="rec-name">${card.card_name}</span>
            </div>
            <div class="rec-stats">
                <div class="rec-stat">
                    <span class="rec-value">${formatCurrency(card.annual_rewards)}</span>
                    <span class="rec-label">Annual Rewards</span>
                </div>
                <div class="rec-stat">
                    <span class="rec-value" style="color: ${card.net_annual_benefit > 0 ? '#00d084' : '#ef4444'}">${formatCurrency(card.net_annual_benefit)}</span>
                    <span class="rec-label">Net Benefit</span>
                </div>
            </div>
            <div class="rec-fee">Annual Fee: ${formatCurrency(card.annual_fee)}</div>
        </div>
    `).join('');
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('CardMax initialized');
    
    // Initialize card features
    populateCards();
    initScrollProgress();
    
    // Initialize card selection (if on upload page)
    initCardSelection();
    
    // Check if we need to show upload section directly
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('view') === 'upload') {
        const cardSection = document.getElementById('cardSelectionSection');
        const uploadSection = document.getElementById('uploadSection');
        if (cardSection) cardSection.style.display = 'none';
        if (uploadSection) {
            uploadSection.style.display = 'block';
            initFileUpload();
        }
    }
    
    // Load dashboard data (if on dashboard)
    if (document.querySelector('.dashboard-page') || urlParams.get('view') === 'dashboard') {
        loadDashboardData();
    }
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const navbar = document.getElementById('navbar');
        if (navbar) {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        }
    });
});