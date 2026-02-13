// Credit Card Quiz Logic

const quizState = {
    currentQ: 1,
    answers: {},
    totalQuestions: 5
};

// Card recommendation database
const cardRecommendations = {
    // High spenders
    'premium-travel-high-experienced-above1L': {
        primary: {
            name: 'HDFC Infinia Metal',
            bank: 'HDFC Bank',
            shortName: 'Infinia Metal',
            fee: '₹12,500',
            reward: '16%',
            savings: '₹85,000',
            type: 'premium',
            reasons: [
                'Your high spending unlocks maximum rewards',
                '16% on travel via SmartBuy is unbeatable',
                '3.3% on everything else adds up fast',
                'Unlimited lounge access for your lifestyle'
            ]
        },
        alternatives: ['Axis Atlas', 'SBI Cashback Card', 'Axis Magnus']
    },
    
    // Online shoppers
    'medium-online-low-new-25to50k': {
        primary: {
            name: 'SBI Cashback Card',
            bank: 'SBI Card',
            shortName: 'Cashback',
            fee: '₹999',
            reward: '5%',
            savings: '₹18,000',
            type: 'cashback',
            reasons: [
                '5% cashback on all online shopping',
                'Low annual fee pays for itself quickly',
                'Perfect for your spending level',
                'Simple redemption, no points confusion'
            ]
        },
        alternatives: ['Amazon Pay ICICI', 'HDFC Millennia', 'Flipkart Axis']
    },
    
    // First card users
    'low-online-free-first-under25k': {
        primary: {
            name: 'Amazon Pay ICICI',
            bank: 'ICICI Bank',
            shortName: 'Amazon Pay',
            fee: 'Lifetime Free',
            reward: '5%',
            savings: '₹6,000',
            type: 'beginner',
            reasons: [
                'Lifetime free - no fees ever',
                'Easy approval for first-time users',
                '5% back on Amazon purchases',
                'Builds credit history safely'
            ]
        },
        alternatives: ['IDFC First Wealth', 'Flipkart Axis', 'HSBC Cashback']
    },
    
    // Bill payers
    'medium-bills-low-new-25to50k': {
        primary: {
            name: 'Axis Ace',
            bank: 'Axis Bank',
            shortName: 'ACE',
            fee: '₹499',
            reward: '5%',
            savings: '₹8,500',
            type: 'bills',
            reasons: [
                '5% cashback on all utility bills',
                'Works with Google Pay seamlessly',
                'Low fee, high practical value',
                'Most people ignore bill rewards - you wont'
            ]
        },
        alternatives: ['SBI Cashback Card', 'Amazon Pay ICICI', 'HDFC Millennia']
    },
    
    // Travel focused
    'high-travel-medium-experienced-50kto1L': {
        primary: {
            name: 'Axis Atlas',
            bank: 'Axis Bank',
            shortName: 'Atlas',
            fee: '₹5,000',
            reward: '10%',
            savings: '₹42,000',
            type: 'travel',
            reasons: [
                'Best airmile conversion in India',
                '10+ airline transfer partners',
                'International lounge access',
                'Perfect for your travel frequency'
            ]
        },
        alternatives: ['HDFC Infinia', 'Axis Magnus', 'Amex MRCC']
    },
    
    // Default fallback
    'default': {
        primary: {
            name: 'SBI Cashback Card',
            bank: 'SBI Card',
            shortName: 'Cashback',
            fee: '₹999',
            reward: '5%',
            savings: '₹15,000',
            type: 'cashback',
            reasons: [
                'Safe choice for most spenders',
                '5% on all online transactions',
                'Low annual fee',
                'Easy to understand and use'
            ]
        },
        alternatives: ['Amazon Pay ICICI', 'Axis Ace', 'HDFC Millennia']
    }
};

function selectOption(question, value, element) {
    // Store answer
    quizState.answers[question] = value;
    
    // Visual selection
    const cards = element.parentElement.querySelectorAll('.option-card');
    cards.forEach(c => c.classList.remove('selected'));
    element.classList.add('selected');
    
    // Enable next button
    document.getElementById('nextBtn').disabled = false;
    
    // Auto-advance on mobile after short delay
    if (window.innerWidth < 768) {
        setTimeout(() => nextQuestion(), 500);
    }
}

function nextQuestion() {
    if (quizState.currentQ < quizState.totalQuestions) {
        // Hide current
        document.querySelector(`.quiz-question[data-q="${quizState.currentQ}"]`).classList.remove('active');
        
        // Show next
        quizState.currentQ++;
        document.querySelector(`.quiz-question[data-q="${quizState.currentQ}"]`).classList.add('active');
        
        // Update progress
        updateProgress();
        
        // Update nav
        document.getElementById('prevBtn').style.visibility = 'visible';
        document.getElementById('nextBtn').disabled = !quizState.answers[quizState.currentQ];
        
        // Check if last question
        if (quizState.currentQ === quizState.totalQuestions) {
            document.getElementById('nextBtn').innerHTML = 'See Results <svg class="icon-svg" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
        }
    } else {
        // Show results
        showResults();
    }
}

function prevQuestion() {
    if (quizState.currentQ > 1) {
        document.querySelector(`.quiz-question[data-q="${quizState.currentQ}"]`).classList.remove('active');
        quizState.currentQ--;
        document.querySelector(`.quiz-question[data-q="${quizState.currentQ}"]`).classList.add('active');
        
        updateProgress();
        
        document.getElementById('prevBtn').style.visibility = quizState.currentQ === 1 ? 'hidden' : 'visible';
        document.getElementById('nextBtn').disabled = false;
        document.getElementById('nextBtn').innerHTML = 'Next <svg class="icon-svg" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
    }
}

function updateProgress() {
    const progress = (quizState.currentQ / quizState.totalQuestions) * 100;
    document.querySelector('.quiz-progress-bar::after')?.style?.setProperty('width', progress + '%');
    document.getElementById('currentQ').textContent = quizState.currentQ;
    
    // Update CSS variable for progress bar
    const bar = document.querySelector('.quiz-progress-bar');
    if (bar) {
        bar.style.setProperty('--progress', progress + '%');
    }
}

function showResults() {
    // Hide quiz elements
    document.querySelectorAll('.quiz-question').forEach(q => q.style.display = 'none');
    document.getElementById('quizNav').style.display = 'none';
    document.querySelector('.quiz-progress-container').style.display = 'none';
    
    // Calculate recommendation
    const result = calculateRecommendation();
    
    // Display results
    displayResults(result);
    
    // Show results container
    document.getElementById('quizResults').classList.add('show');
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function calculateRecommendation() {
    const a = quizState.answers;
    
    // Build lookup key
    const spend = a[1] || 'medium';
    const category = a[2] || 'mixed';
    const fee = a[3] || 'low';
    const experience = a[4] || 'new';
    const salary = a[5] || '25to50k';
    
    // Try exact match first
    let key = `${spend}-${category}-${fee}-${experience}-${salary}`;
    if (cardRecommendations[key]) {
        return cardRecommendations[key];
    }
    
    // Try partial matches
    key = `${spend}-${category}-${fee}-${experience}`;
    const match = Object.keys(cardRecommendations).find(k => k.startsWith(key));
    if (match) return cardRecommendations[match];
    
    // Category-based fallback
    if (category === 'travel') return cardRecommendations['high-travel-medium-experienced-50kto1L'];
    if (category === 'online') return cardRecommendations['medium-online-low-new-25to50k'];
    if (category === 'bills') return cardRecommendations['medium-bills-low-new-25to50k'];
    if (fee === 'free') return cardRecommendations['low-online-free-first-under25k'];
    
    return cardRecommendations['default'];
}

function displayResults(result) {
    const card = result.primary;
    
    // Update main result
    document.getElementById('resultCardName').textContent = card.name;
    document.getElementById('resultCardTagline').textContent = getTagline(card.type);
    document.getElementById('resultBank').textContent = card.bank;
    document.getElementById('resultCardShort').textContent = card.shortName;
    document.getElementById('resultFee').textContent = card.fee;
    document.getElementById('resultReward').textContent = card.reward;
    document.getElementById('resultSavings').textContent = card.savings;
    
    // Update visual theme
    const visual = document.getElementById('resultVisual');
    visual.className = 'result-visual ' + card.type;
    
    // Update reasons
    const reasonsList = document.getElementById('resultReasons');
    reasonsList.innerHTML = card.reasons.map(r => `<li>${r}</li>`).join('');
    
    // Update alternatives
    const altContainer = document.getElementById('altCards');
    altContainer.innerHTML = result.alternatives.map(alt => `
        <div class="alt-card" onclick="showToast('Details coming soon')">
            <h5>${alt}</h5>
            <p>View details →</p>
        </div>
    `).join('');
}

function getTagline(type) {
    const taglines = {
        'premium': 'Best for high spenders who travel',
        'cashback': 'Best for online shopping & simplicity',
        'travel': 'Best for frequent flyers',
        'beginner': 'Best first credit card in India',
        'bills': 'Best for utility bill payments'
    };
    return taglines[type] || 'Recommended for your profile';
}

function restartQuiz() {
    // Reset state
    quizState.currentQ = 1;
    quizState.answers = {};
    
    // Reset UI
    document.querySelectorAll('.quiz-question').forEach(q => {
        q.style.display = '';
        q.classList.remove('active');
    });
    document.querySelector('.quiz-question[data-q="1"]').classList.add('active');
    
    document.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
    
    document.getElementById('quizResults').classList.remove('show');
    document.getElementById('quizNav').style.display = 'flex';
    document.querySelector('.quiz-progress-container').style.display = 'flex';
    document.getElementById('prevBtn').style.visibility = 'hidden';
    document.getElementById('nextBtn').disabled = true;
    document.getElementById('nextBtn').innerHTML = 'Next <svg class="icon-svg" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
    
    updateProgress();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateProgress();
});