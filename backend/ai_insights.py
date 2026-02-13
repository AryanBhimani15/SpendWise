"""
AI Insights Generator
Generates intelligent insights from transaction data
"""

def generate_ai_insights(transactions, totals):
    """
    Generate AI-powered insights from transaction data
    
    Args:
        transactions: List of transaction dictionaries
        totals: Summary dictionary with totals
    
    Returns:
        List of insight dictionaries
    """
    insights = []
    
    # Initialize tracking variables
    category_totals = {}
    international_count = 0
    international_amount = 0
    subscription_merchants = set()
    high_value_transactions = []
    frequent_merchants = {}
    daily_spending = {}
    
    # Analyze all transactions
    for t in transactions:
        cat = t.get('category', 'OTHER')
        amt = t.get('amount', 0)
        desc = t.get('description', '').lower()
        geo = t.get('isInternational', False)
        txn_type = t.get('type', 'Debit')
        date = t.get('date', '')
        
        # Only analyze debit transactions for spending insights
        if txn_type == 'Debit':
            # Track category totals
            category_totals[cat] = category_totals.get(cat, 0) + amt
            
            # Track international spending
            if geo:
                international_count += 1
                international_amount += amt
            
            # Track frequent merchants
            merchant = desc.split()[0] if desc else 'Unknown'
            frequent_merchants[merchant] = frequent_merchants.get(merchant, 0) + 1
            
            # Detect subscriptions
            if any(x in desc for x in ['netflix', 'spotify', 'prime', 'disney', 'hotstar', 'youtube', 'sony', 'zee5', 'voot']):
                subscription_merchants.add(merchant)
            
            # Track high value transactions (>₹10,000)
            if amt > 10000:
                high_value_transactions.append({
                    'description': desc[:50],
                    'amount': amt,
                    'category': cat
                })
    
    total_spend = totals.get('total_spend', 0)
    txn_count = totals.get('transaction_count', 0)
    
    # Insight 1: High category spend alert
    if category_totals:
        top_cat = max(category_totals.items(), key=lambda x: x[1])
        top_pct = (top_cat[1] / max(total_spend, 1)) * 100
        if top_pct > 30:
            insights.append({
                "type": "alert",
                "icon": "⚠️",
                "title": "High Category Spend",
                "description": f"{top_cat[0].replace('_', ' ').title()} accounts for {top_pct:.0f}% of your spending (₹{top_cat[1]:,.0f}). Consider setting a budget for this category."
            })
    
    # Insight 2: International transaction fees
    if international_count > 0:
        forex_markup = international_amount * 0.035
        insights.append({
            "type": "alert",
            "icon": "✈️",
            "title": "International Transaction Fees",
            "description": f"You made {international_count} international transaction(s) totaling ₹{international_amount:,.0f}. You're paying approximately ₹{forex_markup:,.0f} in forex markup fees (3.5%). Consider a card with zero forex markup."
        })
    
    # Insight 3: Subscriptions detected
    if subscription_merchants:
        sub_total = category_totals.get('ENTERTAINMENT', 0) + category_totals.get('UTILITIES', 0)
        insights.append({
            "type": "info",
            "icon": "📺",
            "title": "Active Subscriptions Detected",
            "description": f"Found {len(subscription_merchants)} subscription service(s). Estimated monthly recurring: ~₹{sub_total/3:,.0f}. Review if you're using all of them."
        })
    
    # Insight 4: Large transactions (tax benefits)
    if len(high_value_transactions) > 0:
        total_high = sum(x['amount'] for x in high_value_transactions)
        insights.append({
            "type": "savings",
            "icon": "💰",
            "title": "Large Transactions",
            "description": f"{len(high_value_transactions)} transaction(s) above ₹10,000 totaling ₹{total_high:,.0f}. Track these for potential tax benefits (80C, 80D, etc.)."
        })
    
    # Insight 5: Cashback optimization opportunity
    if total_spend > 50000:
        potential_annual = total_spend * 0.05 * 12
        insights.append({
            "type": "savings",
            "icon": "💳",
            "title": "Cashback Optimization Opportunity",
            "description": f"With ₹{total_spend:,.0f} monthly spend, you could earn ~₹{potential_annual:,.0f}/year with the right credit card combination. Check our recommendations!"
        })
    
    # Insight 6: Frequent merchant
    if frequent_merchants:
        top_merchant = max(frequent_merchants.items(), key=lambda x: x[1])
        if top_merchant[1] >= 5:
            insights.append({
                "type": "info",
                "icon": "🔄",
                "title": "Frequent Merchant",
                "description": f"You transacted {top_merchant[1]} times with '{top_merchant[0].title()}'. Check if they have a co-branded credit card for extra rewards."
            })
    
    # Insight 7: High average transaction
    if txn_count > 0:
        avg_txn = total_spend / txn_count
        if avg_txn > 5000:
            insights.append({
                "type": "info",
                "icon": "📊",
                "title": "High Average Transaction",
                "description": f"Your average transaction is ₹{avg_txn:,.0f}. Consider splitting large purchases across billing cycles to manage cash flow better."
            })
    
    # Insight 8: Spending summary (always included)
    insights.append({
        "type": "success",
        "icon": "📈",
        "title": "Spending Summary",
        "description": f"Total spend: ₹{total_spend:,.0f} across {txn_count} transactions. Domestic: ₹{totals.get('total_domestic', 0):,.0f} | International: ₹{totals.get('total_international', 0):,.0f}"
    })
    
    return insights


def analyze_spending_pattern(transactions):
    """
    Analyze spending patterns and return trends
    
    Args:
        transactions: List of transaction dictionaries
    
    Returns:
        Dictionary with spending patterns
    """
    if not transactions:
        return {}
    
    # Group by date
    daily_amounts = {}
    for t in transactions:
        date = t.get('date', '')
        amount = t.get('amount', 0)
        if t.get('type') == 'Debit' and date:
            daily_amounts[date] = daily_amounts.get(date, 0) + amount
    
    if not daily_amounts:
        return {}
    
    amounts = list(daily_amounts.values())
    avg_daily = sum(amounts) / len(amounts)
    max_daily = max(amounts)
    min_daily = min(amounts)
    
    return {
        'average_daily': avg_daily,
        'max_daily': max_daily,
        'min_daily': min_daily,
        'active_days': len(daily_amounts)
    }


def detect_anomalies(transactions):
    """
    Detect unusual spending patterns
    
    Args:
        transactions: List of transaction dictionaries
    
    Returns:
        List of anomaly dictionaries
    """
    anomalies = []
    
    if len(transactions) < 5:
        return anomalies
    
    # Calculate average transaction amount
    amounts = [t.get('amount', 0) for t in transactions if t.get('type') == 'Debit']
    if not amounts:
        return anomalies
    
    avg_amount = sum(amounts) / len(amounts)
    threshold = avg_amount * 3  # 3x average is considered anomaly
    
    for t in transactions:
        if t.get('type') == 'Debit' and t.get('amount', 0) > threshold:
            anomalies.append({
                'date': t.get('date'),
                'description': t.get('description'),
                'amount': t.get('amount'),
                'reason': f'Unusually high (3x average of ₹{avg_amount:,.0f})'
            })
    
    return anomalies