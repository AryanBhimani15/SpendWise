// Calculator functionality

function calculateLoss() {
    const online = parseFloat(document.getElementById('onlineSpend')?.value) || 0;
    const dining = parseFloat(document.getElementById('diningSpend')?.value) || 0;
    const travel = parseFloat(document.getElementById('travelSpend')?.value) || 0;
    const other = parseFloat(document.getElementById('otherSpend')?.value) || 0;
    
    const total = online + dining + travel + other;
    
    const resultBox = document.getElementById('resultBox');
    const calcBtn = document.getElementById('calcBtn');
    
    if (total > 0) {
        const annualLoss = Math.round(total * 12 * 0.025);
        const lossAmount = document.getElementById('lossAmount');
        if (lossAmount) {
            lossAmount.textContent = '₹' + annualLoss.toLocaleString('en-IN');
        }
        if (resultBox) resultBox.classList.add('show');
        if (calcBtn) calcBtn.style.display = 'none';
    } else {
        if (resultBox) resultBox.classList.remove('show');
        if (calcBtn) calcBtn.style.display = 'block';
    }
}