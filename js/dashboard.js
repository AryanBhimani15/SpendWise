// Dashboard functionality and chart animations

function startDemo() {
    document.getElementById('uploadState').classList.remove('active');
    document.getElementById('analyzingState').classList.add('active');
    
    let progress = 0;
    const progressBar = document.getElementById('demoProgress');
    const interval = setInterval(() => {
        progress += 2;
        progressBar.style.width = progress + '%';
        
        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                document.getElementById('analyzingState').classList.remove('active');
                document.getElementById('resultsState').classList.add('active');
                document.getElementById('step2').classList.remove('active');
                document.getElementById('step3').classList.remove('active');
                document.getElementById('step4').classList.add('active');
            }, 500);
        }
    }, 50);

    document.getElementById('step1').classList.remove('active');
    document.getElementById('step2').classList.add('active');
    setTimeout(() => {
        document.getElementById('step2').classList.remove('active');
        document.getElementById('step3').classList.add('active');
    }, 1500);
}

function showDashboard() {
    const dashboard = document.getElementById('demoDashboard');
    dashboard.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
        animateDashboard();
    }, 300);
}

function closeDashboard() {
    const dashboard = document.getElementById('demoDashboard');
    dashboard.classList.remove('active');
    document.body.style.overflow = '';
}

function animateDashboard() {
    animateValue('dashTotal', 0, 245000, 1500, '₹');
    animateValue('dashMissed', 0, 24500, 1500, '₹');
    animateValue('dashTxns', 0, 47, 1000, '');
    animateValue('pieCenterValue', 0, 245000, 1500, '₹');

    setTimeout(() => {
        animatePieChart();
    }, 400);

    const barData = [
        { id: 'barFill1', valId: 'barVal1', height: 65, value: 158000 },
        { id: 'barFill2', valId: 'barVal2', height: 80, value: 195000 },
        { id: 'barFill3', valId: 'barVal3', height: 45, value: 110000 },
        { id: 'barFill4', valId: 'barVal4', height: 90, value: 220000 },
        { id: 'barFill5', valId: 'barVal5', height: 75, value: 183000 },
        { id: 'barFill6', valId: 'barVal6', height: 100, value: 245000 }
    ];

    barData.forEach((bar, i) => {
        const fillEl = document.getElementById(bar.id);
        const valEl = document.getElementById(bar.valId);
        
        if (fillEl) fillEl.style.height = '0%';
        if (valEl) valEl.classList.remove('show');
        
        setTimeout(() => {
            if (fillEl) fillEl.style.height = bar.height + '%';
            if (valEl) valEl.classList.add('show');
            animateValue(bar.valId, 0, bar.value, 800, '₹');
        }, 800 + i * 100);
    });
}

function animatePieChart() {
    const segments = [
        { id: 'pieSegment1', target: 35 },
        { id: 'pieSegment2', target: 25 },
        { id: 'pieSegment3', target: 20 },
        { id: 'pieSegment4', target: 20 }
    ];

    let accumulated = 0;
    const radius = 38;
    const circumference = 2 * Math.PI * radius;

    segments.forEach((seg, i) => {
        const element = document.getElementById(seg.id);
        if (!element) return;
        
        const dashArray = (seg.target / 100) * circumference;
        const offset = -((accumulated / 100) * circumference);
        
        element.style.strokeDasharray = `0 ${circumference}`;
        element.style.strokeDashoffset = 0;
        
        setTimeout(() => {
            element.style.transition = 'stroke-dasharray 1.2s cubic-bezier(0.23, 1, 0.32, 1), stroke-dashoffset 1.2s cubic-bezier(0.23, 1, 0.32, 1)';
            element.style.strokeDasharray = `${dashArray} ${circumference}`;
            element.style.strokeDashoffset = offset;
        }, 300 + i * 200);
        
        accumulated += seg.target;
    });

    // Add hover interactions
    segments.forEach((seg) => {
        const element = document.getElementById(seg.id);
        if (!element) return;
        
        element.addEventListener('mouseenter', (e) => {
            showTooltip(e, seg.id);
            element.style.strokeWidth = '28';
            element.style.filter = 'drop-shadow(0 8px 16px rgba(0,0,0,0.2))';
        });
        
        element.addEventListener('mouseleave', () => {
            hideTooltip();
            element.style.strokeWidth = '24';
            element.style.filter = 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))';
        });
        
        element.addEventListener('mousemove', moveTooltip);
    });
}

function showTooltip(e, segmentId) {
    const tooltip = document.getElementById('segmentTooltip');
    const segment = document.getElementById(segmentId);
    if (!tooltip || !segment) return;
    
    const label = segment.getAttribute('data-label');
    const value = segment.getAttribute('data-value');
    const amount = segment.getAttribute('data-amount');
    
    tooltip.innerHTML = `<strong>${label}</strong><br>${value} · ${amount}`;
    tooltip.classList.add('show');
    moveTooltip(e);
}

function moveTooltip(e) {
    const tooltip = document.getElementById('segmentTooltip');
    const container = document.getElementById('pieContainer');
    if (!tooltip || !container) return;
    
    const rect = container.getBoundingClientRect();
    tooltip.style.left = (e.clientX - rect.left) + 'px';
    tooltip.style.top = (e.clientY - rect.top - 50) + 'px';
}

function hideTooltip() {
    const tooltip = document.getElementById('segmentTooltip');
    if (tooltip) tooltip.classList.remove('show');
}

function highlightSegment(index) {
    const segments = ['pieSegment1', 'pieSegment2', 'pieSegment3', 'pieSegment4'];
    
    segments.forEach((id, i) => {
        const el = document.getElementById(id);
        if (!el) return;
        
        if (i === index) {
            el.style.strokeWidth = '28';
            el.style.filter = 'drop-shadow(0 8px 16px rgba(0,0,0,0.2))';
            el.style.opacity = '1';
        } else {
            el.style.opacity = '0.3';
        }
    });
}

function resetSegment() {
    const segments = ['pieSegment1', 'pieSegment2', 'pieSegment3', 'pieSegment4'];
    
    segments.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        
        el.style.strokeWidth = '24';
        el.style.filter = 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))';
        el.style.opacity = '1';
    });
}
// Dashboard.js - Handles the analyzer dashboard display

document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the dashboard page
    if (document.getElementById('totalSpent') || document.getElementById('dashTotal')) {
        loadDashboardData();
    }
});

function loadDashboardData() {
    // Get analysis data from localStorage
    const data = localStorage.getItem('cardmax_analysis');
    
    if (!data) {
        console.log('No analysis data found');
        // Show upload prompt if no data
        showNoDataState();
        return;
    }
    
    try {
        const analysis = JSON.parse(data);
        console.log('Loading analysis data:', analysis);
        
        // Update summary cards
        updateSummaryCards(analysis.totals);
        
        // Update pie chart with categories
        updateCategoryChart(analysis.category_totals);
        
        // Update transactions table
        updateTransactionsTable(analysis.transactions);
        
        // Update AI insights
        updateInsights(analysis.ai_insights);
        
        // Update best cards recommendations
        updateBestCards(analysis.best_cards);
        
        // Update rewards analysis
        updateRewardsAnalysis(analysis.rewards_analysis);
        
    } catch (e) {
        console.error('Error loading analysis:', e);
        showErrorState();
    }
}

function showNoDataState() {
    const container = document.querySelector('.dashboard-container');
    if (container) {
        container.innerHTML = `
            <div class="no-data-state">
                <div class="no-data-icon">
                    <svg viewBox="0 0 24 24" width="64" height="64">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                        <line x1="16" y1="13" x2="8" y2="13"/>
                        <line x1="16" y1="17" x2="8" y2="17"/>
                        <polyline points="10 9 9 9 8 9"/>
                    </svg>
                </div>
                <h2>No Statement Analyzed Yet</h2>
                <p>Upload your credit card statement to see your spending breakdown and find hidden rewards.</p>
                <button class="btn-primary" onclick="window.location.href='analyzer.html'">
                    Upload Statement
                </button>
            </div>
        `;
    }
}

function showErrorState() {
    showToast('Error loading analysis data. Please try uploading again.');
}

function updateSummaryCards(totals) {
    if (!totals) return;
    
    // Update various possible element IDs
    const totalSpent = totals.total_spend || 0;
    const transactionCount = totals.transaction_count || 0;
    const domestic = totals.total_domestic || 0;
    const international = totals.total_international || 0;
    
    // Find top category
    const categoryBreakdown = totals.category_breakdown || {};
    let topCategory = '-';
    let topAmount = 0;
    
    Object.entries(categoryBreakdown).forEach(([cat, amount]) => {
        if (amount > topAmount && cat !== 'CASHBACK' && cat !== 'OTHER') {
            topAmount = amount;
            topCategory = cat.replace(/_/g, ' ').toLowerCase();
        }
    });
    
    // Capitalize first letter
    topCategory = topCategory.charAt(0).toUpperCase() + topCategory.slice(1);
    
    // Update DOM elements
    updateElement('totalSpent', formatCurrency(totalSpent));
    updateElement('dashTotal', formatCurrency(totalSpent));
    updateElement('transactionCount', transactionCount + ' txn' + (transactionCount !== 1 ? 's' : ''));
    updateElement('dashTxns', transactionCount);
    updateElement('topCategory', topCategory);
    updateElement('domesticSpend', formatCurrency(domestic));
    updateElement('internationalSpend', formatCurrency(international));
    
    // Animate the numbers
    animateValue('totalSpent', 0, totalSpent, 1000);
    animateValue('dashTotal', 0, totalSpent, 1000);
}

function updateElement(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

function formatCurrency(amount) {
    if (amount === 0 || amount === undefined || amount === null) return '₹0';
    return '₹' + Math.round(amount).toLocaleString('en-IN');
}

function animateValue(id, start, end, duration) {
    const obj = document.getElementById(id);
    if (!obj) return;
    
    // Check if already has animation class
    if (obj.classList.contains('animating')) return;
    
    obj.classList.add('animating');
    const range = end - start;
    const minTimer = 50;
    let stepTime = Math.abs(Math.floor(duration / range));
    stepTime = Math.max(stepTime, minTimer);
    
    let startTime = new Date().getTime();
    let endTime = startTime + duration;
    let timer;
    
    function run() {
        let now = new Date().getTime();
        let remaining = Math.max((endTime - now) / duration, 0);
        let value = Math.round(end - (remaining * range));
        
        // Format based on element type
        if (obj.id.includes('Spent') || obj.id.includes('Total')) {
            obj.textContent = formatCurrency(value);
        } else {
            obj.textContent = value.toLocaleString('en-IN');
        }
        
        if (value == end) {
            clearInterval(timer);
            obj.classList.remove('animating');
        }
    }
    
    timer = setInterval(run, stepTime);
    run();
}

function updateCategoryChart(categoryTotals) {
    const container = document.getElementById('categoryChart') || document.getElementById('pieChart');
    if (!container || !categoryTotals) return;
    
    // Filter out small categories and cashback
    const filtered = Object.entries(categoryTotals)
        .filter(([cat, amount]) => amount > 100 && cat !== 'CASHBACK')
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6); // Top 6 categories
    
    if (filtered.length === 0) {
        container.innerHTML = '<p class="no-data">No category data available</p>';
        return;
    }
    
    const total = filtered.reduce((sum, [, amount]) => sum + amount, 0);
    const colors = ['#00d084', '#a855f7', '#fb923c', '#f472b6', '#ef4444', '#ec4899'];
    
    // Create SVG pie chart
    let svgContent = '';
    let legendContent = '';
    let currentAngle = 0;
    
    filtered.forEach(([category, amount], i) => {
        const percentage = (amount / total) * 100;
        const angle = (amount / total) * 360;
        const color = colors[i % colors.length];
        
        // Create pie slice
        const startAngle = currentAngle;
        const endAngle = currentAngle + angle;
        
        const x1 = 50 + 35 * Math.cos((startAngle - 90) * Math.PI / 180);
        const y1 = 50 + 35 * Math.sin((startAngle - 90) * Math.PI / 180);
        const x2 = 50 + 35 * Math.cos((endAngle - 90) * Math.PI / 180);
        const y2 = 50 + 35 * Math.sin((endAngle - 90) * Math.PI / 180);
        
        const largeArc = angle > 180 ? 1 : 0;
        const path = `M 50 50 L ${x1} ${y1} A 35 35 0 ${largeArc} 1 ${x2} ${y2} Z`;
        
        svgContent += `<path d="${path}" fill="${color}" stroke="white" stroke-width="2" 
            style="opacity: 0; animation: sliceIn 0.5s ease forwards; animation-delay: ${i * 0.1}s"
            onmouseenter="highlightCategory('${category}', ${percentage.toFixed(1)}, ${amount})"
            onmouseleave="resetCategory()"/>`;
        
        // Create legend item
        legendContent += `
            <div class="legend-item" style="animation: fadeIn 0.5s ease forwards; animation-delay: ${i * 0.1}s">
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
                <svg viewBox="0 0 100 100" class="pie-chart-svg">
                    ${svgContent}
                    <circle cx="50" cy="50" r="20" fill="white"/>
                    <text x="50" y="48" text-anchor="middle" font-size="8" fill="#666">Total</text>
                    <text x="50" y="58" text-anchor="middle" font-size="10" font-weight="bold" fill="#333">${formatCurrency(total)}</text>
                </svg>
                <div id="categoryTooltip" class="category-tooltip"></div>
            </div>
            <div class="pie-legend">
                ${legendContent}
            </div>
        </div>
    `;
}

function highlightCategory(category, percentage, amount) {
    const tooltip = document.getElementById('categoryTooltip');
    if (tooltip) {
        tooltip.innerHTML = `
            <strong>${category.replace(/_/g, ' ')}</strong><br>
            ${percentage}% · ${formatCurrency(amount)}
        `;
        tooltip.style.opacity = '1';
    }
}

function resetCategory() {
    const tooltip = document.getElementById('categoryTooltip');
    if (tooltip) tooltip.style.opacity = '0';
}

function updateTransactionsTable(transactions) {
    const tbody = document.getElementById('transactionsBody');
    if (!tbody || !transactions) return;
    
    // Show only first 10 transactions, sorted by date (newest first)
    const sorted = [...transactions]
        .filter(t => t.type === 'Debit')
        .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
        .slice(0, 10);
    
    if (sorted.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="no-data">No transactions found</td></tr>';
        return;
    }
    
    tbody.innerHTML = sorted.map((t, i) => `
        <tr style="animation: fadeIn 0.3s ease forwards; animation-delay: ${i * 0.05}s">
            <td>${t.date || '-'}</td>
            <td>${t.merchant || t.description || '-'}</td>
            <td><span class="category-badge ${t.category?.toLowerCase()}">${t.category?.replace(/_/g, ' ') || 'Other'}</span></td>
            <td class="amount">${formatCurrency(t.amount)}</td>
        </tr>
    `).join('');
}

function updateInsights(insights) {
    const container = document.getElementById('insightsContainer');
    if (!container || !insights) return;
    
    if (insights.length === 0) {
        container.innerHTML = '<p class="no-data">No insights available</p>';
        return;
    }
    
    container.innerHTML = insights.map((insight, i) => `
        <div class="insight-card ${insight.type}" style="animation: slideIn 0.5s ease forwards; animation-delay: ${i * 0.1}s">
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
    
    if (bestCards.length === 0) {
        container.innerHTML = '<p class="no-data">No card recommendations available</p>';
        return;
    }
    
    container.innerHTML = bestCards.slice(0, 3).map((card, i) => `
        <div class="recommendation-card" style="animation: fadeIn 0.5s ease forwards; animation-delay: ${i * 0.15}s">
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
                    <span class="rec-value">${formatCurrency(card.net_annual_benefit)}</span>
                    <span class="rec-label">Net Benefit</span>
                </div>
            </div>
            <div class="rec-fee">Annual Fee: ${formatCurrency(card.annual_fee)}</div>
        </div>
    `).join('');
}

function updateRewardsAnalysis(rewardsAnalysis) {
    const container = document.getElementById('rewardsContainer');
    if (!container || !rewardsAnalysis || rewardsAnalysis.length === 0) return;
    
    const topCard = rewardsAnalysis[0];
    
    container.innerHTML = `
        <div class="rewards-summary">
            <div class="reward-highlight">
                <span class="reward-label">Best Card for You</span>
                <span class="reward-value">${topCard.card_name}</span>
            </div>
            <div class="reward-highlight">
                <span class="reward-label">Monthly Rewards</span>
                <span class="reward-value">${formatCurrency(topCard.monthly_rewards)}</span>
            </div>
            <div class="reward-highlight">
                <span class="reward-label">Annual Net Benefit</span>
                <span class="reward-value" style="color: #00d084">${formatCurrency(topCard.net_annual_benefit)}</span>
            </div>
        </div>
    `;
}

// Export for use in other files
window.loadDashboardData = loadDashboardData;
window.updateCategoryChart = updateCategoryChart;