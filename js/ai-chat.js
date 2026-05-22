// SpendWise AI Chatbot - FIXED VERSION
(function() {
    'use strict';

    console.log('🤖 AI Chatbot loading...');

    // ============================================
    // SPENDWISE BRAIN - Core Logic
    // ============================================
    const SpendWiseBrain = {
        cards: [
            {
                id: 'hdfc-infinia', name: 'HDFC Infinia Metal', bank: 'HDFC Bank',
                annualFee: 12500, type: 'Premium', bestFor: ['travel', 'luxury'],
                rates: { online: 0.16, travel: 0.16, dining: 0.033, bills: 0.016, general: 0.033 },
                forex: 0.02, lounge: 'Unlimited Global', minIncome: 3000000,
                pros: ['Highest reward potential', 'Unlimited lounges', '16% on travel'],
                cons: ['High annual fee', 'Difficult approval', 'Complex redemption']
            },
            {
                id: 'sbi-cashback', name: 'SBI Cashback Card', bank: 'SBI Card',
                annualFee: 999, type: 'Cashback', bestFor: ['online', 'shopping'],
                rates: { online: 0.05, travel: 0.01, dining: 0.01, bills: 0.01, general: 0.01 },
                forex: 0.035, lounge: 'None', minIncome: 300000,
                pros: ['Simple 5% cashback', 'Low fee', 'Wide acceptance'],
                cons: ['No lounge access', 'Monthly caps', 'High forex markup']
            },
            {
                id: 'axis-ace', name: 'Axis Ace', bank: 'Axis Bank',
                annualFee: 499, type: 'Bills', bestFor: ['bills', 'utilities'],
                rates: { online: 0.02, travel: 0.01, dining: 0.04, bills: 0.05, general: 0.02 },
                forex: 0.035, lounge: 'None', minIncome: 300000,
                pros: ['5% on bills', 'Low fee', 'Google Pay integration'],
                cons: ['Monthly cap ₹500', 'No lounge', 'Limited partners']
            },
            {
                id: 'amazon-pay-icici', name: 'Amazon Pay ICICI', bank: 'ICICI Bank',
                annualFee: 0, type: 'Beginner', bestFor: ['amazon', 'shopping'],
                rates: { online: 0.05, travel: 0.01, dining: 0.02, bills: 0.02, general: 0.01 },
                forex: 0.035, lounge: 'None', minIncome: 250000,
                pros: ['Lifetime free', 'Easy approval', 'Prime benefits'],
                cons: ['Limited to Amazon', 'No lounge', 'Lower base rewards']
            },
            {
                id: 'axis-atlas', name: 'Axis Atlas', bank: 'Axis Bank',
                annualFee: 5000, type: 'Travel', bestFor: ['travel', 'flights'],
                rates: { online: 0.02, travel: 0.10, dining: 0.02, bills: 0.02, general: 0.02 },
                forex: 0.02, lounge: 'International + Domestic', minIncome: 600000,
                pros: ['Best airmiles', '10+ partners', 'Good lounge access'],
                cons: ['Annual fee', 'Complex points', 'Approval time']
            },
            {
                id: 'hdfc-millennia', name: 'HDFC Millennia', bank: 'HDFC Bank',
                annualFee: 1000, type: 'Millennial', bestFor: ['online', 'dining', 'travel'],
                rates: { online: 0.05, travel: 0.05, dining: 0.05, bills: 0.01, general: 0.01 },
                forex: 0.035, lounge: 'None', minIncome: 300000,
                pros: ['5% on popular sites', 'Low fee', 'Good for beginners'],
                cons: ['Monthly caps', 'Points expire', 'No lounge']
            },
            {
                id: 'idfc-first-wealth', name: 'IDFC First Wealth', bank: 'IDFC Bank',
                annualFee: 0, type: 'Premium LTF', bestFor: ['high_spend', 'forex'],
                rates: { online: 0.025, travel: 0.025, dining: 0.025, bills: 0.025, general: 0.025 },
                forex: 0.015, lounge: 'Domestic + International', minIncome: 500000,
                pros: ['Lifetime free', 'Flat 2.5% rewards', 'Low forex markup'],
                cons: ['Newer bank', 'Limited acceptance', 'No bonus categories']
            },
            {
                id: 'flipkart-axis', name: 'Flipkart Axis', bank: 'Axis Bank',
                annualFee: 500, type: 'Shopping', bestFor: ['flipkart', 'myntra'],
                rates: { online: 0.05, travel: 0.04, dining: 0.04, bills: 0.01, general: 0.01 },
                forex: 0.035, lounge: 'None', minIncome: 250000,
                pros: ['5% Flipkart cashback', '4% Myntra', 'Low fee'],
                cons: ['Flipkart focused', 'No lounge', 'Caps apply']
            }
        ],

        categorySynonyms: {
            'online': ['online', 'shopping', 'amazon', 'flipkart', 'myntra', 'ecommerce', 'web', 'internet', 'app', 'purchase'],
            'travel': ['travel', 'flight', 'hotel', 'booking', 'uber', 'ola', 'rapido', 'cab', 'train', 'irctc', 'vacation', 'trip', 'makemytrip', 'goibibo'],
            'dining': ['dining', 'food', 'restaurant', 'swiggy', 'zomato', 'eat', 'cafe', 'lunch', 'dinner', 'breakfast', 'pizza', 'burger'],
            'bills': ['bills', 'utilities', 'electricity', 'water', 'gas', 'recharge', 'phone', 'wifi', 'broadband', 'utility', 'payment'],
            'grocery': ['grocery', 'groceries', 'supermarket', 'bigbasket', 'blinkit', 'zepto', 'dmart', 'vegetables', 'fruits'],
            'fuel': ['fuel', 'petrol', 'diesel', 'gas', 'cng', 'hp', 'iocl', 'bpcl', 'shell', 'pump'],
            'entertainment': ['entertainment', 'movies', 'netflix', 'prime', 'hotstar', 'subscription', 'ott', 'disney', 'sony'],
            'general': ['general', 'other', 'default', 'everything else', 'rest']
        },

        getBestCard(category, amount = 10000) {
            const cat = this.normalizeCategory(category);
            const sorted = this.cards.map(card => {
                const rate = card.rates[cat] || card.rates.general;
                const monthlyReward = amount * rate;
                const netBenefit = (monthlyReward * 12) - card.annualFee;
                return { ...card, rate, monthlyReward, netBenefit };
            }).sort((a, b) => b.netBenefit - a.netBenefit);
            return sorted[0];
        },

        getTopCards(category, amount = 10000, n = 3) {
            const cat = this.normalizeCategory(category);
            return this.cards.map(card => {
                const rate = card.rates[cat] || card.rates.general;
                const monthlyReward = amount * rate;
                const annualReward = monthlyReward * 12;
                const netBenefit = annualReward - card.annualFee;
                return { 
                    name: card.name, bank: card.bank, rate, monthlyReward, 
                    annualReward, annualFee: card.annualFee, netBenefit,
                    match: rate >= 0.05 ? 'Excellent' : rate >= 0.03 ? 'Good' : 'Average'
                };
            }).sort((a, b) => b.netBenefit - a.netBenefit).slice(0, n);
        },

        calculatePersonalizedRewards(spendingData) {
            return this.cards.map(card => {
                let totalMonthly = 0;
                let breakdown = {};
                for (const [category, amount] of Object.entries(spendingData)) {
                    const rate = card.rates[category] || card.rates.general;
                    const reward = amount * rate;
                    totalMonthly += reward;
                    breakdown[category] = { amount, rate, reward };
                }
                const annualReward = totalMonthly * 12;
                return {
                    name: card.name, bank: card.bank, annualFee: card.annualFee,
                    monthlyReward: totalMonthly, annualReward, netBenefit: annualReward - card.annualFee,
                    breakdown, forex: card.forex, lounge: card.lounge
                };
            }).sort((a, b) => b.netBenefit - a.netBenefit);
        },

        calculateLoss(online = 0, dining = 0, travel = 0, bills = 0, other = 0) {
            const spending = { online, dining, travel, bills, general: other };
            const results = this.calculatePersonalizedRewards(spending);
            const best = results[0];
            const worst = results[results.length - 1];
            return {
                monthly: best.monthlyReward, annual: best.annualReward, bestCard: best.name,
                potentialLoss: worst.netBenefit < 0 ? Math.abs(worst.netBenefit) : 0,
                usingWorstCard: worst.name, improvement: ((best.annualReward - worst.annualReward) / Math.max(worst.annualReward, 1) * 100).toFixed(0)
            };
        },

        normalizeCategory(input) {
            const lower = input.toLowerCase();
            for (const [category, synonyms] of Object.entries(this.categorySynonyms)) {
                if (synonyms.some(s => lower.includes(s))) return category;
            }
            return 'general';
        },

        getCard(query) {
            const lower = query.toLowerCase();
            return this.cards.find(c => 
                c.id.toLowerCase().includes(lower) || 
                c.name.toLowerCase().includes(lower) ||
                c.bank.toLowerCase().includes(lower)
            );
        },

        checkEligibility(cardId, income) {
            const card = this.cards.find(c => c.id === cardId || c.name.toLowerCase().includes(cardId.toLowerCase()));
            if (!card) return null;
            return {
                eligible: income >= card.minIncome, minIncome: card.minIncome, yourIncome: income,
                gap: card.minIncome - income, difficulty: card.minIncome > 1000000 ? 'Difficult' : card.minIncome > 500000 ? 'Moderate' : 'Easy'
            };
        }
    };

    // ============================================
    // AI RESPONSE GENERATOR
    // ============================================
    const AIEngine = {
        async generateResponse(message) {
            const lower = message.toLowerCase();
            
            if (this.isBestCardQuery(lower)) return this.handleBestCard(lower);
            if (this.isComparisonQuery(lower)) return this.handleComparison(lower);
            if (this.isCalculatorQuery(lower)) return this.handleCalculator(lower);
            if (this.isCardDetailsQuery(lower)) return this.handleCardDetails(lower);
            if (this.isEligibilityQuery(lower)) return this.handleEligibility(lower);
            if (this.isGreeting(lower)) return this.handleGreeting();
            
            return "Try asking me:\n• 'Which card for online shopping?'\n• 'Compare HDFC Infinia and SBI Cashback'\n• 'Calculate rewards for ₹15000 online spend'\n• 'Am I eligible for Axis Ace?'";
        },

        isBestCardQuery(lower) {
            return lower.includes('which card') || lower.includes('best card') || lower.includes('should i use') || 
                   lower.includes('what card for') || lower.includes('recommended for') || lower.includes('good for') ||
                   lower.includes('card for') || lower.includes('best for');
        },
        isComparisonQuery(lower) {
            return (lower.includes('compare') || lower.includes('vs') || lower.includes('versus') || lower.includes('which is better')) && 
                   (lower.includes('card') || lower.includes('infinia') || lower.includes('cashback') || lower.includes('ace') || lower.includes('atlas'));
        },
        isCalculatorQuery(lower) {
            return lower.includes('calculate') || lower.includes('how much') || lower.includes('savings') || 
                   lower.includes('losing') || lower.includes('rewards') || lower.includes('estimate') || lower.includes('if i spend');
        },
        isCardDetailsQuery(lower) {
            const cardKeywords = ['infinia', 'cashback', 'ace', 'atlas', 'millennia', 'amazon pay', 'idfc', 'flipkart', 'wealth'];
            return cardKeywords.some(k => lower.includes(k)) && 
                   (lower.includes('tell me') || lower.includes('about') || lower.includes('details') || lower.includes('features') || lower.includes('how is'));
        },
        isEligibilityQuery(lower) {
            return lower.includes('eligible') || lower.includes('can i get') || lower.includes('approval') || 
                   lower.includes('income') || lower.includes('salary') || lower.includes('can i apply');
        },
        isGreeting(lower) {
            return lower.includes('hi') || lower.includes('hello') || lower.includes('hey') || 
                   lower.includes('good morning') || lower.includes('good evening') || lower.includes('help');
        },

        handleBestCard(lower) {
            let category = 'general';
            for (const [cat, synonyms] of Object.entries(SpendWiseBrain.categorySynonyms)) {
                if (synonyms.some(s => lower.includes(s))) { category = cat; break; }
            }
            const amountMatch = lower.match(/₹?(\d+)/);
            const amount = amountMatch ? parseInt(amountMatch[1]) : 10000;
            const best = SpendWiseBrain.getBestCard(category, amount);
            const runnersUp = SpendWiseBrain.getTopCards(category, amount, 3).slice(1);
            
            let response = `For **${category}** spending of ${this.formatCurrency(amount)}, the best card is:\n\n🏆 **${best.name}** (${best.bank})\n💵 **Reward Rate:** ${(best.rate * 100).toFixed(1)}%\n📈 **Monthly Rewards:** ${this.formatCurrency(best.monthlyReward)}\n💰 **Annual (after fee):** ${this.formatCurrency(best.netBenefit)}\n\n`;
            if (runnersUp.length > 0) {
                response += `**Also good:**\n`;
                runnersUp.forEach((card, i) => {
                    response += `${i+2}. ${card.name} — ${this.formatCurrency(card.monthlyReward)}/mo (${(card.rate*100).toFixed(0)}%)\n`;
                });
            }
            return response;
        },

        handleComparison(lower) {
            const cards = SpendWiseBrain.cards.filter(c => 
                lower.includes(c.id) || lower.includes(c.name.toLowerCase())
            );
            if (cards.length >= 2) {
                const [c1, c2] = cards;
                let response = `**${c1.name}** vs **${c2.name}**\n\n💰 **Annual Fee:**\n• ${c1.name}: ₹${c1.annualFee.toLocaleString('en-IN')}\n• ${c2.name}: ₹${c2.annualFee.toLocaleString('en-IN')}\nWinner: ${c1.annualFee < c2.annualFee ? c1.name : c2.name}\n\n📊 **Reward Rates:**\n`;
                ['online', 'travel', 'dining', 'bills'].forEach(cat => {
                    const r1 = c1.rates[cat] || 0;
                    const r2 = c2.rates[cat] || 0;
                    const winner = r1 > r2 ? c1.name : r2 > r1 ? c2.name : 'Tie';
                    response += `• ${cat}: ${(r1*100).toFixed(0)}% vs ${(r2*100).toFixed(0)}% → ${winner}\n`;
                });
                return response;
            }
            return "Tell me which two cards to compare (e.g., 'compare HDFC Infinia vs SBI Cashback').";
        },

        handleCalculator(lower) {
            const spending = { online: 0, dining: 0, travel: 0, bills: 0, other: 0 };
            const matches = lower.matchAll(/(online|dining|travel|bills|other).*?₹?(\d+)/gi);
            for (const match of matches) {
                const cat = match[1].toLowerCase();
                const amt = parseInt(match[2]);
                if (spending[cat] !== undefined) spending[cat] = amt;
            }
            if (Object.values(spending).every(v => v === 0)) {
                return "Tell me your monthly spending like: 'online ₹15000, dining ₹8000, travel ₹5000'";
            }
            const result = SpendWiseBrain.calculateLoss(spending.online, spending.dining, spending.travel, spending.bills, spending.other);
            return `💡 **Results**\n\nBest card: **${result.bestCard}**\n• Monthly rewards: **${this.formatCurrency(result.monthly)}**\n• Annual: **${this.formatCurrency(result.annual)}**\n\nIf using a basic 1% card, you're losing **${this.formatCurrency(result.annual * 0.5)}** annually!`;
        },

        handleCardDetails(lower) {
            const card = SpendWiseBrain.getCard(lower);
            if (!card) return "Which card? (e.g., 'tell me about HDFC Infinia')";
            let response = `**${card.name}** — ${card.bank}\n\n💳 **Type:** ${card.type}\n💰 **Annual Fee:** ₹${card.annualFee.toLocaleString('en-IN')}\n🌍 **Forex:** ${(card.forex * 100).toFixed(1)}%\n✈️ **Lounge:** ${card.lounge}\n\n**Rewards:**\n`;
            for (const [cat, rate] of Object.entries(card.rates)) {
                if (rate > 0.01) response += `• ${cat}: ${(rate * 100).toFixed(1)}%\n`;
            }
            response += `\n✅ **Pros:** ${card.pros.join(', ')}\n❌ **Cons:** ${card.cons.join(', ')}`;
            return response;
        },

        handleEligibility(lower) {
            const incomeMatch = lower.match(/(?:income|salary|earn).*?₹?(\d+)(?:\s*(?:l|lakhs?))?/i);
            let income = 0;
            if (incomeMatch) {
                income = parseInt(incomeMatch[1]);
                if (lower.includes('l') || lower.includes('lakh')) income *= 100000;
            }
            const card = SpendWiseBrain.getCard(lower);
            if (!card) return "Which card? (e.g., 'am I eligible for HDFC Infinia with ₹8L income?')";
            if (income === 0) return `For **${card.name}**, you need **${this.formatCurrency(card.minIncome)}** income per year.`;
            
            const eligible = income >= card.minIncome;
            return `With **${this.formatCurrency(income)}** income:\n\n${eligible ? '✅' : '❌'} **${card.name}**: ${eligible ? 'You qualify!' : `Need ${this.formatCurrency(card.minIncome - income)} more`}\nRequired: ${this.formatCurrency(card.minIncome)}`;
        },

        handleGreeting() {
            return "👋 Hey! I'm your AI card advisor. Ask me:\n• 'Best card for online shopping?'\n• 'Compare HDFC Infinia vs SBI Cashback'\n• 'Calculate rewards for ₹15000 spend'\n• 'Am I eligible for Axis Ace?'";
        },

        formatCurrency(amount) {
            if (!amount || amount === 0) return '₹0';
            if (amount >= 100000) return '₹' + (amount / 100000).toFixed(1) + 'L';
            return '₹' + amount.toLocaleString('en-IN');
        }
    };

    // ============================================
    // UI CONTROLLER - FIXED VERSION
    // ============================================
    const ChatWidget = {
        isOpen: false,
        initialized: false,

        init() {
            if (this.initialized) {
                console.log('Chatbot already initialized');
                return;
            }
            console.log('Initializing chatbot...');
            
            this.injectStyles();
            this.injectHTML();
            this.bindEvents();
            
            this.initialized = true;
            console.log('✅ Chatbot ready!');
        },

        injectStyles() {
            if (document.getElementById('sw-ai-styles')) return;
            
            const css = document.createElement('style');
            css.id = 'sw-ai-styles';
            css.textContent = `
                #sw-ai-widget {
                    --sw-bg: #f5f1eb;
                    --sw-surface: #ffffff;
                    --sw-text: #5c4d3c;
                    --sw-accent: #d4a574;
                    --sw-border: #e8e4df;
                    --sw-shadow: 0 20px 60px rgba(92, 77, 60, 0.15);
                    position: fixed;
                    bottom: 24px;
                    right: 24px;
                    z-index: 9999;
                    font-family: 'Inter', sans-serif;
                }
                #sw-ai-trigger-btn {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    background: var(--sw-text);
                    color: var(--sw-surface);
                    border: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: var(--sw-shadow);
                    transition: all 0.3s ease;
                    position: relative;
                    font-size: 24px;
                }
                #sw-ai-trigger-btn:hover {
                    transform: scale(1.1);
                    background: var(--sw-accent);
                }
                #sw-ai-trigger-btn.pulse::after {
                    content: '';
                    position: absolute;
                    inset: -4px;
                    border-radius: 50%;
                    border: 2px solid var(--sw-accent);
                    animation: swPulse 2s infinite;
                }
                @keyframes swPulse {
                    0% { transform: scale(1); opacity: 0.6; }
                    100% { transform: scale(1.3); opacity: 0; }
                }
                #sw-ai-panel {
                    position: absolute;
                    bottom: 76px;
                    right: 0;
                    width: 400px;
                    max-height: 600px;
                    background: var(--sw-surface);
                    border-radius: 24px;
                    box-shadow: var(--sw-shadow);
                    border: 1px solid var(--sw-border);
                    display: none;
                    flex-direction: column;
                    overflow: hidden;
                }
                #sw-ai-panel.active {
                    display: flex;
                    animation: swSlideIn 0.3s ease;
                }
                @keyframes swSlideIn {
                    from { opacity: 0; transform: translateY(20px) scale(0.95); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                #sw-ai-header {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 20px;
                    background: var(--sw-bg);
                    border-bottom: 1px solid var(--sw-border);
                }
                #sw-ai-avatar {
                    width: 40px;
                    height: 40px;
                    background: var(--sw-text);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 20px;
                }
                #sw-ai-title {
                    flex: 1;
                }
                #sw-ai-title h4 {
                    margin: 0;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 16px;
                    color: var(--sw-text);
                }
                #sw-ai-title span {
                    font-size: 12px;
                    color: #6b6b6b;
                }
                #sw-ai-close-btn {
                    width: 32px;
                    height: 32px;
                    border: none;
                    background: transparent;
                    cursor: pointer;
                    border-radius: 8px;
                    font-size: 18px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                #sw-ai-close-btn:hover {
                    background: var(--sw-border);
                }
                #sw-ai-messages {
                    flex: 1;
                    overflow-y: auto;
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    max-height: 400px;
                    min-height: 300px;
                }
                .sw-message {
                    display: flex;
                    gap: 12px;
                    animation: swMessageIn 0.3s ease;
                }
                @keyframes swMessageIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .sw-message.ai { flex-direction: row; }
                .sw-message.user { flex-direction: row-reverse; }
                .sw-bubble {
                    max-width: 85%;
                    padding: 14px 18px;
                    border-radius: 18px;
                    font-size: 14px;
                    line-height: 1.6;
                    white-space: pre-line;
                }
                .sw-message.ai .sw-bubble {
                    background: var(--sw-bg);
                    color: var(--sw-text);
                    border-bottom-left-radius: 6px;
                }
                .sw-message.user .sw-bubble {
                    background: var(--sw-text);
                    color: var(--sw-surface);
                    border-bottom-right-radius: 6px;
                }
                .sw-bubble strong {
                    font-weight: 600;
                    color: #5c4d3c;
                }
                #sw-ai-input-area {
                    padding: 16px 20px 20px;
                    background: var(--sw-surface);
                    border-top: 1px solid var(--sw-border);
                }
                #sw-ai-suggestions {
                    display: flex;
                    gap: 8px;
                    overflow-x: auto;
                    margin-bottom: 12px;
                    padding-bottom: 4px;
                }
                #sw-ai-suggestions::-webkit-scrollbar { display: none; }
                .sw-suggestion-btn {
                    white-space: nowrap;
                    padding: 8px 16px;
                    background: transparent;
                    border: 1px solid var(--sw-border);
                    border-radius: 20px;
                    font-size: 12px;
                    color: var(--sw-text);
                    cursor: pointer;
                    transition: all 0.2s;
                    font-family: inherit;
                }
                .sw-suggestion-btn:hover {
                    background: var(--sw-bg);
                    border-color: var(--sw-accent);
                }
                #sw-ai-input-wrap {
                    display: flex;
                    gap: 8px;
                    align-items: center;
                }
                #sw-ai-input {
                    flex: 1;
                    padding: 14px 20px;
                    border: 2px solid var(--sw-border);
                    border-radius: 28px;
                    font-size: 14px;
                    font-family: inherit;
                    background: var(--sw-surface);
                    color: var(--sw-text);
                    outline: none;
                }
                #sw-ai-input:focus {
                    border-color: var(--sw-accent);
                    box-shadow: 0 0 0 4px rgba(212, 165, 116, 0.15);
                }
                #sw-ai-send-btn {
                    width: 44px;
                    height: 44px;
                    border: none;
                    background: var(--sw-text);
                    color: var(--sw-surface);
                    border-radius: 50%;
                    cursor: pointer;
                    font-size: 18px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                }
                #sw-ai-send-btn:hover {
                    background: var(--sw-accent);
                    transform: scale(1.05);
                }
                .sw-typing {
                    display: flex;
                    gap: 4px;
                    padding: 14px 18px;
                    background: var(--sw-bg);
                    border-radius: 18px;
                    border-bottom-left-radius: 6px;
                    width: fit-content;
                }
                .sw-typing span {
                    width: 8px;
                    height: 8px;
                    background: var(--sw-accent);
                    border-radius: 50%;
                    animation: swTyping 1.4s infinite;
                }
                .sw-typing span:nth-child(2) { animation-delay: 0.2s; }
                .sw-typing span:nth-child(3) { animation-delay: 0.4s; }
                @keyframes swTyping {
                    0%, 60%, 100% { transform: translateY(0); }
                    30% { transform: translateY(-10px); }
                }
                @media (max-width: 480px) {
                    #sw-ai-widget { bottom: 16px; right: 16px; }
                    #sw-ai-panel { width: calc(100vw - 32px); right: 0; max-height: 70vh; }
                    #sw-ai-messages { max-height: 50vh; }
                }
            `;
            document.head.appendChild(css);
        },

        injectHTML() {
            if (document.getElementById('sw-ai-widget')) return;
            
            const div = document.createElement('div');
            div.id = 'sw-ai-widget';
            div.innerHTML = `
                <button id="sw-ai-trigger-btn" title="Ask AI">🤖</button>
                <div id="sw-ai-panel">
                    <div id="sw-ai-header">
                        <div id="sw-ai-avatar">🎧</div>
                        <div id="sw-ai-title">
                            <h4>SpendWise AI</h4>
                            <span>Smart card advisor</span>
                        </div>
                        <button id="sw-ai-close-btn">✕</button>
                    </div>
                    <div id="sw-ai-messages">
                        <div class="sw-message ai">
                            <div class="sw-bubble">👋 Hey! I'm your AI card advisor. Ask me:\n• "Best card for online shopping?"\n• "Compare HDFC Infinia vs SBI Cashback"\n• "Calculate rewards for ₹15000 spend"\n• "Am I eligible for Axis Ace?"</div>
                        </div>
                    </div>
                    <div id="sw-ai-input-area">
                        <div id="sw-ai-suggestions">
                            <button class="sw-suggestion-btn" data-msg="Best card for online shopping?">Best for online?</button>
                            <button class="sw-suggestion-btn" data-msg="Compare HDFC Infinia vs SBI Cashback">Compare cards</button>
                            <button class="sw-suggestion-btn" data-msg="Calculate my rewards">Calculate rewards</button>
                        </div>
                        <div id="sw-ai-input-wrap">
                            <input type="text" id="sw-ai-input" placeholder="Ask anything about cards..." autocomplete="off">
                            <button id="sw-ai-send-btn">➤</button>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(div);
        },

        bindEvents() {
            const trigger = document.getElementById('sw-ai-trigger-btn');
            const closeBtn = document.getElementById('sw-ai-close-btn');
            const sendBtn = document.getElementById('sw-ai-send-btn');
            const input = document.getElementById('sw-ai-input');
            const panel = document.getElementById('sw-ai-panel');

            // Toggle panel
            trigger.addEventListener('click', (e) => {
                e.stopPropagation();
                console.log('Trigger clicked');
                this.toggle();
            });

            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggle();
            });

            // Send message
            sendBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.send();
            });

            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.send();
                }
            });

            // Suggestion buttons
            document.querySelectorAll('.sw-suggestion-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const msg = btn.getAttribute('data-msg');
                    if (msg) this.send(msg);
                });
            });

            // Close on outside click
            document.addEventListener('click', (e) => {
                if (this.isOpen && !panel.contains(e.target) && e.target !== trigger) {
                    this.toggle();
                }
            });

            // Prevent panel clicks from closing
            panel.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        },

        toggle() {
            const panel = document.getElementById('sw-ai-panel');
            this.isOpen = !this.isOpen;
            
            if (this.isOpen) {
                panel.classList.add('active');
                document.getElementById('sw-ai-input').focus();
                console.log('Panel opened');
            } else {
                panel.classList.remove('active');
                console.log('Panel closed');
            }
        },

        async send(message) {
            const input = document.getElementById('sw-ai-input');
            
            if (!message) {
                message = input.value.trim();
            }
            
            if (!message) return;
            
            input.value = '';
            
            // Add user message
            this.addMessage('user', message);
            
            // Show typing
            const typingId = this.showTyping();
            
            // Get AI response (with small delay for realism)
            await new Promise(r => setTimeout(r, 600));
            const response = await AIEngine.generateResponse(message);
            
            // Remove typing and add response
            this.removeTyping(typingId);
            this.addMessage('ai', response);
        },

        addMessage(sender, text) {
            const container = document.getElementById('sw-ai-messages');
            const div = document.createElement('div');
            div.className = `sw-message ${sender}`;
            div.innerHTML = `<div class="sw-bubble">${this.escapeHtml(text)}</div>`;
            container.appendChild(div);
            container.scrollTop = container.scrollHeight;
        },

        showTyping() {
            const container = document.getElementById('sw-ai-messages');
            const id = 'typing-' + Date.now();
            const div = document.createElement('div');
            div.className = 'sw-message ai';
            div.id = id;
            div.innerHTML = `<div class="sw-typing"><span></span><span></span><span></span></div>`;
            container.appendChild(div);
            container.scrollTop = container.scrollHeight;
            return id;
        },

        removeTyping(id) {
            const el = document.getElementById(id);
            if (el) el.remove();
        },

        escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }
    };

    // Initialize when DOM is ready
    function init() {
        console.log('DOM ready, initializing chatbot...');
        ChatWidget.init();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose to global for debugging
    window.SpendWiseAI = { ChatWidget, AIEngine, SpendWiseBrain };
})();