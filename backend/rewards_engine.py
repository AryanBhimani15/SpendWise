"""
Credit Card Rewards Engine
Calculates rewards for different cards based on spending patterns
"""

# Credit Card Database with reward structures
CREDIT_CARDS = {
    # HDFC Cards
    'hdfc_millennia': {
        'name': 'HDFC Millennia',
        'annual_fee': 1000,
        'rewards': {
            'FOOD_DINING': 0.05,  # 5% on food
            'SHOPPING': 0.025,    # 2.5% on shopping
            'ENTERTAINMENT': 0.05, # 5% on entertainment
            'default': 0.01       # 1% default
        },
        'forex_markup': 0.035
    },
    'hdfc_regalia': {
        'name': 'HDFC Regalia',
        'annual_fee': 2500,
        'rewards': {
            'TRAVEL': 0.04,       # 4% on travel
            'HOTELS': 0.04,
            'default': 0.02       # 2% default
        },
        'forex_markup': 0.02    # 2% forex markup
    },
    'hdfc_infinia': {
        'name': 'HDFC Infinia',
        'annual_fee': 12500,
        'rewards': {
            'TRAVEL': 0.033,      # 3.3%
            'HOTELS': 0.033,
            'SHOPPING': 0.033,
            'default': 0.033
        },
        'forex_markup': 0.02
    },
    
    # SBI Cards
    'sbi_prime': {
        'name': 'SBI Card Prime',
        'annual_fee': 2999,
        'rewards': {
            'FOOD_DINING': 0.05,
            'GROCERIES': 0.05,
            'default': 0.02
        },
        'forex_markup': 0.035
    },
    'sbi_cashback': {
        'name': 'SBI Cashback',
        'annual_fee': 999,
        'rewards': {
            'FOOD_DINING': 0.05,
            'SHOPPING': 0.05,
            'default': 0.01
        },
        'forex_markup': 0.035
    },
    
    # Axis Cards
    'axis_ace': {
        'name': 'Axis Bank Ace',
        'annual_fee': 499,
        'rewards': {
            'FOOD_DINING': 0.04,
            'UTILITIES': 0.04,
            'default': 0.02
        },
        'forex_markup': 0.035
    },
    'axis_flipkart': {
        'name': 'Axis Flipkart',
        'annual_fee': 500,
        'rewards': {
            'SHOPPING': 0.05,
            'default': 0.015
        },
        'forex_markup': 0.035
    },
    'axis_magnus': {
        'name': 'Axis Magnus',
        'annual_fee': 12500,
        'rewards': {
            'default': 0.012
        },
        'forex_markup': 0.02
    },
    
    # ICICI Cards
    'icici_amazon_pay': {
        'name': 'ICICI Amazon Pay',
        'annual_fee': 0,
        'rewards': {
            'SHOPPING': 0.05,
            'default': 0.01
        },
        'forex_markup': 0.035
    },
    'icici_coral': {
        'name': 'ICICI Coral',
        'annual_fee': 500,
        'rewards': {
            'FOOD_DINING': 0.025,
            'ENTERTAINMENT': 0.025,
            'default': 0.01
        },
        'forex_markup': 0.035
    },
    
    # Amex Cards
    'amex_membership_rewards': {
        'name': 'Amex Membership Rewards',
        'annual_fee': 4500,
        'rewards': {
            'default': 0.01
        },
        'forex_markup': 0.035
    },
    'amex_platinum_travel': {
        'name': 'Amex Platinum Travel',
        'annual_fee': 3500,
        'rewards': {
            'TRAVEL': 0.02,
            'default': 0.01
        },
        'forex_markup': 0.035
    },
    
    # Citi Cards
    'citi_cashback': {
        'name': 'Citi Cashback',
        'annual_fee': 0,
        'rewards': {
            'UTILITIES': 0.05,
            'default': 0.005
        },
        'forex_markup': 0.035
    },
    'citi_premiermiles': {
        'name': 'Citi PremierMiles',
        'annual_fee': 3000,
        'rewards': {
            'TRAVEL': 0.04,
            'default': 0.02
        },
        'forex_markup': 0.035
    },
    
    # Standard Chartered
    'sc_digi_smart': {
        'name': 'SC DigiSmart',
        'annual_fee': 0,
        'rewards': {
            'FOOD_DINING': 0.03,
            'GROCERIES': 0.03,
            'default': 0.01
        },
        'forex_markup': 0.035
    },
    
    # IDFC
    'idfc_first_wealth': {
        'name': 'IDFC First Wealth',
        'annual_fee': 0,
        'rewards': {
            'FOOD_DINING': 0.03,
            'SHOPPING': 0.03,
            'TRAVEL': 0.03,
            'ENTERTAINMENT': 0.03,
            'GROCERIES': 0.03,
            'default': 0.015
        },
        'forex_markup': 0.01
    },
    
    # AU Bank
    'au_altura_plus': {
        'name': 'AU Altura Plus',
        'annual_fee': 0,
        'rewards': {
            'FUEL': 0.025,
            'default': 0.01
        },
        'forex_markup': 0.035
    },
    
    # Yes Bank
    'yes_marquee': {
        'name': 'YES Marquee',
        'annual_fee': 0,
        'rewards': {
            'default': 0.025
        },
        'forex_markup': 0.025
    },
    
    # Kotak
    'kotak_811_dream_different': {
        'name': 'Kotak 811 Dream Different',
        'annual_fee': 0,
        'rewards': {
            'default': 0.01
        },
        'forex_markup': 0.035
    },
    
    # IndusInd
    'indusind_pinnacle': {
        'name': 'IndusInd Pinnacle',
        'annual_fee': 0,
        'rewards': {
            'default': 0.025
        },
        'forex_markup': 0.035
    },
    
    # Federal Bank
    'federal_signet': {
        'name': 'Federal Signet',
        'annual_fee': 0,
        'rewards': {
            'default': 0.03
        },
        'forex_markup': 0.03
    },
    
    # RBL
    'rbl_shoppers_stop': {
        'name': 'RBL Shoppers Stop',
        'annual_fee': 0,
        'rewards': {
            'SHOPPING': 0.05,
            'default': 0.01
        },
        'forex_markup': 0.035
    },
    
    # HSBC
    'hsbc_cashback': {
        'name': 'HSBC Cashback',
        'annual_fee': 0,
        'rewards': {
            'default': 0.015
        },
        'forex_markup': 0.035
    },
    
    # OneCard
    'onecard': {
        'name': 'OneCard',
        'annual_fee': 0,
        'rewards': {
            'default': 0.01
        },
        'forex_markup': 0.01
    }
}


def calculate_rewards_for_card(card_id, spending_by_category, international_spend=0):
    """
    Calculate rewards for a specific card based on spending
    
    Args:
        card_id: ID of the credit card
        spending_by_category: Dictionary of {category: amount}
        international_spend: Total international spending amount
    
    Returns:
        Dictionary with reward calculations
    """
    if card_id not in CREDIT_CARDS:
        return None
    
    card = CREDIT_CARDS[card_id]
    total_rewards = 0
    category_rewards = {}
    
    for category, amount in spending_by_category.items():
        # Get reward rate for category, fallback to default
        rate = card['rewards'].get(category, card['rewards'].get('default', 0.01))
        reward = amount * rate
        category_rewards[category] = {
            'spend': amount,
            'rate': rate,
            'reward': reward
        }
        total_rewards += reward
    
    # Calculate forex savings if international spend
    forex_savings = 0
    if international_spend > 0:
        typical_markup = 0.035  # Standard 3.5% forex markup
        card_markup = card.get('forex_markup', 0.035)
        forex_savings = international_spend * (typical_markup - card_markup)
    
    annual_fee = card['annual_fee']
    net_benefit = (total_rewards * 12) - annual_fee + (forex_savings * 12)
    
    return {
        'card_id': card_id,
        'card_name': card['name'],
        'annual_fee': annual_fee,
        'monthly_rewards': total_rewards,
        'annual_rewards': total_rewards * 12,
        'category_breakdown': category_rewards,
        'forex_savings_monthly': forex_savings,
        'net_annual_benefit': net_benefit
    }


def calculate_rewards(spending_by_category, international_spend=0):
    """
    Calculate rewards for all cards
    
    Args:
        spending_by_category: Dictionary of {category: amount}
        international_spend: Total international spending amount
    
    Returns:
        List of reward calculations for all cards, sorted by net benefit
    """
    results = []
    
    for card_id in CREDIT_CARDS:
        result = calculate_rewards_for_card(card_id, spending_by_category, international_spend)
        if result:
            results.append(result)
    
    # Sort by net annual benefit (descending)
    results.sort(key=lambda x: x['net_annual_benefit'], reverse=True)
    
    return results


def find_best_cards(spending_by_category, international_spend=0, top_n=3):
    """
    Find top N best cards for the spending pattern
    
    Args:
        spending_by_category: Dictionary of {category: amount}
        international_spend: Total international spending amount
        top_n: Number of top cards to return
    
    Returns:
        List of top N card reward calculations
    """
    all_cards = calculate_rewards(spending_by_category, international_spend)
    return all_cards[:top_n]


def calculate_missed_rewards(user_card_id, spending_by_category, international_spend=0):
    """
    Calculate rewards missed by using current card vs best card
    
    Args:
        user_card_id: ID of user's current card
        spending_by_category: Dictionary of {category: amount}
        international_spend: Total international spending amount
    
    Returns:
        Dictionary with missed rewards comparison
    """
    user_rewards = calculate_rewards_for_card(user_card_id, spending_by_category, international_spend)
    best_cards = find_best_cards(spending_by_category, international_spend, top_n=1)
    
    if not user_rewards or not best_cards:
        return None
    
    best_card = best_cards[0]
    
    missed_monthly = best_card['monthly_rewards'] - user_rewards['monthly_rewards']
    missed_annual = missed_monthly * 12
    
    return {
        'current_card': user_rewards['card_name'],
        'current_rewards_annual': user_rewards['annual_rewards'],
        'best_card': best_card['card_name'],
        'best_rewards_annual': best_card['annual_rewards'],
        'missed_rewards_monthly': max(0, missed_monthly),
        'missed_rewards_annual': max(0, missed_annual),
        'potential_savings': max(0, missed_annual - best_card['annual_fee'] + user_rewards['annual_fee'])
    }


def get_card_recommendations(spending_by_category, current_cards=None):
    """
    Get personalized card recommendations based on spending
    
    Args:
        spending_by_category: Dictionary of {category: amount}
        current_cards: List of card IDs user already has
    
    Returns:
        List of recommended cards with reasons
    """
    if current_cards is None:
        current_cards = []
    
    all_cards = calculate_rewards(spending_by_category)
    recommendations = []
    
    for card in all_cards:
        if card['card_id'] not in current_cards and card['net_annual_benefit'] > 0:
            # Generate recommendation reason
            top_category = max(card['category_breakdown'].items(), 
                             key=lambda x: x[1]['reward'])[0]
            
            reason = f"Best for {top_category.replace('_', ' ').title()} spending"
            
            recommendations.append({
                **card,
                'recommendation_reason': reason
            })
    
    return recommendations[:5]