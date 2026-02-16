// Card database and card-related functionality

const cardDatabase = [
    {
        id: 1,
        bank: "HDFC Bank",
        name: "Infinia Metal Edition",
        type: "Premium Travel",
        annualFee: "₹12,500",
        theme: "dark",
        rewards: [
            { percent: "5%", category: "Travel bookings via SmartBuy", details: "Flights, hotels on HDFC portal" },
            { percent: "3.3%", category: "All other spends", details: "3 RP per ₹150, redeemable for flights" },
            { percent: "2%", category: "Dining & Entertainment", details: "Accelerated rewards" }
        ]
    },
    {
        id: 2,
        bank: "SBI Card",
        name: "Cashback Card",
        type: "Cashback",
        annualFee: "₹999",
        theme: "accent",
        rewards: [
            { percent: "5%", category: "Online spends", details: "All online transactions" },
            { percent: "1%", category: "Offline spends", details: "All other purchases" },
            { percent: "1%", category: "Fuel surcharge waiver", details: "Up to ₹100 per month" }
        ]
    },
    {
        id: 3,
        bank: "Axis Bank",
        name: "Ace Credit Card",
        type: "Bill Payments",
        annualFee: "₹499",
        theme: "light",
        rewards: [
            { percent: "5%", category: "Google Pay bill payments", details: "Electricity, mobile, DTH" },
            { percent: "4%", category: "Swiggy, Zomato", details: "Food delivery apps" },
            { percent: "2%", category: "All other spends", details: "Unlimited cashback" }
        ]
    },
    {
        id: 4,
        bank: "ICICI Bank",
        name: "Amazon Pay Card",
        type: "Shopping",
        annualFee: "₹500",
        theme: "accent",
        rewards: [
            { percent: "5%", category: "Amazon purchases", details: "For Prime members" },
            { percent: "3%", category: "Amazon purchases", details: "For non-Prime members" },
            { percent: "2%", category: "Digital payments", details: "Amazon Pay partner merchants" }
        ]
    },
    {
        id: 5,
        bank: "HDFC Bank",
        name: "Millennia Card",
        type: "Millennial",
        annualFee: "₹1,000",
        theme: "dark",
        rewards: [
            { percent: "5%", category: "Amazon, Flipkart, Zomato", details: "Selected merchants" },
            { percent: "2.5%", category: "Other online spends", details: "All online transactions" },
            { percent: "1%", category: "Offline spends", details: "All other purchases" }
        ]
    },
    {
        id: 6,
        bank: "Axis Bank",
        name: "Magnus Card",
        type: "Premium",
        annualFee: "₹12,500",
        theme: "dark",
        rewards: [
            { percent: "12%", category: "Travel edge portal", details: "Book via Axis portal" },
            { percent: "5%", category: "All other spends", details: "Unlimited rewards" },
            { percent: "Unlimited", category: "Airport lounge access", details: "Domestic & international" }
        ]
    },
    {
        id: 7,
        bank: "SBI Card",
        name: "Prime Card",
        type: "Lifestyle",
        annualFee: "₹2,999",
        theme: "accent",
        rewards: [
            { percent: "5%", category: "Dining & Movies", details: "Everyday spends" },
            { percent: "2%", category: "Grocery & Departmental", details: "Daily essentials" },
            { percent: "1%", category: "Other retail", details: "All other spends" }
        ]
    },
    {
        id: 8,
        bank: "ICICI Bank",
        name: "Coral Card",
        type: "Lifestyle",
        annualFee: "₹500",
        theme: "light",
        rewards: [
            { percent: "2X", category: "Dining & Groceries", details: "Bonus reward points" },
            { percent: "1X", category: "All other spends", details: "Standard rewards" },
            { percent: "Free", category: "Movie tickets", details: "Buy 1 get 1 free" }
        ]
    }
];

let currentCardIndex = 0;
let filteredCards = [...cardDatabase];

function populateCards() {
    const track = document.getElementById('cardsTrack');
    if (!track) return;
    
    track.innerHTML = '';
    
    filteredCards.forEach((card, index) => {
        const cardEl = document.createElement('div');
        cardEl.className = 'card-item';
        cardEl.onclick = () => openCardModal(card, index);
        
        const themeClass = card.theme === 'dark' ? 'dark' : card.theme === 'accent' ? 'accent' : 'light';
        const cardClass = card.theme === 'dark' ? 'dark-card' : card.theme === 'accent' ? 'accent-card' : '';
        
        cardEl.innerHTML = `
            <div class="card-preview-small ${themeClass}">
                <div class="mini-card ${cardClass}">
                    <div class="mini-header">
                        <span class="mini-bank">${card.bank}</span>
                        <div class="mini-chip"></div>
                    </div>
                    <div class="mini-number">•••• ${4582 + index}</div>
                    <div class="mini-footer">
                        <span class="mini-name">${card.name}</span>
                        <span class="mini-brand">VISA</span>
                    </div>
                </div>
            </div>
            <div class="card-info">
                <div class="card-badges">
                    <span class="badge badge-bank">${card.bank}</span>
                    <span class="badge badge-type">${card.type}</span>
                    <span class="badge badge-fee">${card.annualFee}</span>
                </div>
                <h3>${card.name}</h3>
                <div class="card-rewards-preview">
                    ${card.rewards.slice(0, 2).map(r => `<span class="reward-pill"><strong>${r.percent}</strong> ${r.category}</span>`).join('')}
                </div>
            </div>
        `;
        
        track.appendChild(cardEl);
    });
}

function openCardModal(card, index) {
    currentCardIndex = index !== undefined ? index : cardDatabase.findIndex(c => c.id === card.id);
    const modal = document.getElementById('cardModal');
    const hero = document.getElementById('modalHero');
    
    document.getElementById('modalBank').textContent = card.bank;
    document.getElementById('modalTitle').textContent = card.name;
    document.getElementById('modalType').textContent = card.type;
    document.getElementById('modalFee').textContent = `Annual Fee: ${card.annualFee}`;
    document.getElementById('modalCounter').textContent = `${currentCardIndex + 1} / ${filteredCards.length}`;
    
    hero.className = 'modal-hero ' + card.theme;
    
    const rewardsList = document.getElementById('modalRewards');
    rewardsList.innerHTML = card.rewards.map(r => `
        <div class="reward-item">
            <div class="reward-percent">${r.percent}</div>
            <div class="reward-details">
                <h4>${r.category}</h4>
                <p>${r.details}</p>
            </div>
        </div>
    `).join('');
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCardModal(event) {
    if (!event || event.target.id === 'cardModal' || event.target.classList.contains('modal-close')) {
        document.getElementById('cardModal').classList.remove('active');
        document.body.style.overflow = '';
    }
}

function navigateCard(direction) {
    currentCardIndex += direction;
    if (currentCardIndex < 0) currentCardIndex = filteredCards.length - 1;
    if (currentCardIndex >= filteredCards.length) currentCardIndex = 0;
    
    openCardModal(filteredCards[currentCardIndex], currentCardIndex);
}

function filterCards(filter) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.includes(filter) || (filter === 'all' && btn.textContent === 'All Cards')) {
            btn.classList.add('active');
        }
    });
    
    if (filter === 'all') {
        filteredCards = [...cardDatabase];
    } else if (['Premium', 'Cashback'].includes(filter)) {
        filteredCards = cardDatabase.filter(c => c.type.includes(filter));
    } else {
        filteredCards = cardDatabase.filter(c => c.bank.includes(filter));
    }
    
    populateCards();
    updateScrollProgress();
}

function scrollCards(direction) {
    const track = document.getElementById('cardsTrack');
    const scrollAmount = 350;
    
    if (direction === 'left') {
        track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
        track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
}

function updateScrollProgress() {
    const track = document.getElementById('cardsTrack');
    const progress = document.getElementById('scrollProgress');
    const scrollPercent = (track.scrollLeft / (track.scrollWidth - track.clientWidth)) * 100;
    progress.style.width = Math.max(0, Math.min(100, scrollPercent)) + '%';
}

function rotateStack(index) {
    const items = document.querySelectorAll('.featured-item');
    items.forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });

    const cards = document.querySelectorAll('.stack-card');
    cards.forEach((card, i) => {
        if (i === index) {
            card.style.transform = 'translate(-50%, -50%) translateZ(0px) rotateY(0deg)';
            card.style.zIndex = 3;
            card.style.opacity = 1;
        } else if (i < index) {
            card.style.transform = `translate(-50%, -50%) translateZ(-${(index - i) * 50}px) translateX(-${(index - i) * 30}px) rotateY(-${(index - i) * 5}deg)`;
            card.style.zIndex = 3 - (index - i);
            card.style.opacity = 0.8 - ((index - i) * 0.2);
        } else {
            card.style.transform = `translate(-50%, -50%) translateZ(-${(i - index) * 50}px) translateX(${(i - index) * 30}px) rotateY(${(i - index) * 5}deg)`;
            card.style.zIndex = 3 - (i - index);
            card.style.opacity = 0.8 - ((i - index) * 0.2);
        }
    });
}

// Initialize cards on load
document.addEventListener('DOMContentLoaded', () => {
    populateCards();
    const track = document.getElementById('cardsTrack');
    if (track) {
        track.addEventListener('scroll', updateScrollProgress);
    }
});
