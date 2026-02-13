import pandas as pd
import re
from datetime import datetime

# EXPANDED CATEGORY KEYWORDS - More comprehensive to minimize "OTHER"
CATEGORY_KEYWORDS = {
    'FOOD_DINING': [
        'restaurant', 'food', 'swiggy', 'zomato', 'uber eats', 'dominos', 'pizza', 
        'cafe', 'coffee', 'starbucks', 'burger', 'mcdonalds', 'kfc', 'dining', 
        'eat', 'kitchen', 'biryani', 'dhaba', 'sweets', 'bakery', 'ice cream',
        'bar', 'pub', 'liquor', 'wine', 'beer', 'beverage', 'juice', 'chaat',
        'tiffin', 'catering', 'mess', 'hotel', 'saravana', 'haldiram', 'bikaner',
        'faasos', 'box8', 'freshmenu', 'eatsure', 'magicpin', 'dunzo', 'eats',
        'pizza hut', 'subway', 'burger king', 'taco bell', 'kfc', 'dominos',
        'zomato', 'swiggy', 'uber eats', 'dunzo', 'eatsure', 'magicpin'
    ],
    'SHOPPING': [
        'amazon', 'flipkart', 'myntra', 'ajio', 'shopify', 'store', 'mart', 'mall', 
        'fashion', 'clothing', 'electronics', 'reliance', 'tata', 'cliq', 'nykaa',
        'meesho', 'snapdeal', 'shopclues', 'limeroad', 'jabong', 'zivame', 'firstcry',
        'decathlon', 'sports', 'shoes', 'footwear', 'jewelry', 'gold', 'silver',
        'furniture', 'home', 'decor', 'ikea', 'pepperfry', 'urban ladder', 'lenskart',
        'pharmeasy', '1mg', 'netmeds', 'medlife', 'grofers', 'bigbasket',
        'amazon.in', 'flipkart.com', 'myntra.com', 'ajio.com', 'nykaa.com',
        'meesho.com', 'snapdeal.com', 'shopclues.com', 'limeroad.com',
        'tatacliq.com', 'reliancedigital.in', 'croma.com', 'vijay sales'
    ],
    'TRAVEL': [
        'uber', 'ola', 'rapido', 'airline', 'flight', 'hotel', 'booking', 'irctc', 
        'train', 'bus', 'travel', 'goibibo', 'makemytrip', 'cleartrip', 'yatra',
        'easemytrip', 'ixigo', 'redbus', 'abhibus', 'taxi', 'cab', 'auto', 'rental',
        'airport', 'railway', 'station', 'trip', 'tour', 'vacation', 'holiday',
        'oyo', 'airbnb', 'trivago', 'expedia', 'booking.com', 'agoda', 'hostel',
        'uber.com', 'ola.com', 'rapido.in', 'redbus.in', 'abhibus.com',
        'makemytrip.com', 'goibibo.com', 'cleartrip.com', 'yatra.com',
        'irctc.co.in', 'trainman.in', 'confirmtkt.com'
    ],
    'ENTERTAINMENT': [
        'netflix', 'prime', 'hotstar', 'spotify', 'movie', 'cinema', 'theatre', 
        'bookmyshow', 'disney', 'youtube premium', 'sony', 'zee5', 'voot', 'altbalaji',
        'eros', 'hungama', 'wynk', 'gaana', 'jiosaavn', 'amazon music', 'apple music',
        'gaming', 'game', 'playstation', 'xbox', 'steam', 'pubg', 'freefire',
        'event', 'concert', 'show', 'amusement', 'park', 'museum', 'club', 'party',
        'netflix.com', 'primevideo.com', 'hotstar.com', 'sonyliv.com',
        'zee5.com', 'voot.com', 'altbalaji.com', 'bookmyshow.com',
        'spotify.com', 'gaana.com', 'jiosaavn.com', 'wynk.in'
    ],
    'UTILITIES': [
        'electricity', 'water', 'gas', 'bill', 'recharge', 'phone', 'broadband', 
        'wifi', 'utility', 'power', 'energy', 'bsnl', 'mtnl', 'airtel', 'jio',
        'vodafone', 'idea', 'vi', 'tata power', 'adani', 'torrent', 'mahadiscom',
        'bescom', 'tsspdcl', 'msedcl', 'dgvcl', 'ugvcl', 'pgvcl', 'mgvcl',
        'lpg', 'cylinder', 'indane', 'hp gas', 'bharat gas', 'png', 'cng',
        'airtel.in', 'jio.com', 'vodafone.in', 'idea.com', 'myvi.in',
        'tatapower.com', 'adanielectricity.com', 'mahadiscom.in',
        'bescom.org', 'tsspdcl.in', 'msedcl.in'
    ],
    'GROCERIES': [
        'grocery', 'supermarket', 'bigbasket', 'blinkit', 'zepto', 'kirana', 
        'dmart', 'reliance fresh', 'more', 'spencer', 'easyday', 'natures basket',
        'foodhall', 'ratnadeep', 'spar', 'hypercity', 'star bazaar', 'big bazaar',
        'vegetable', 'fruits', 'dairy', 'milk', 'bread', 'eggs', 'meat', 'fish',
        'organic', 'farm', 'fresh', 'apna', 'jio mart', 'flipkart quick',
        'bigbasket.com', 'blinkit.com', 'zepto.com', 'dmart.in', 'jiomart.com',
        'reliancefresh.com', 'morestore.com', 'spencers.in', 'naturesbasket.co.in'
    ],
    'HEALTH': [
        'pharmacy', 'medical', 'hospital', 'clinic', 'doctor', 'health', 
        'apollo', 'medplus', '1mg', 'netmeds', 'pharmeasy', 'medlife', 'diagnostic',
        'lab', 'pathology', 'scan', 'xray', 'dental', 'eye', 'vision', 'physio',
        'therapy', 'ayurveda', 'homeopathy', 'wellness', 'fitness', 'gym', 'yoga',
        'max', 'fortis', 'manipal', 'narayana', 'columbia', 'aster', 'care',
        'apollohospitals.com', 'maxhealthcare.in', 'fortishealthcare.com',
        'manipalhospitals.com', 'narayanahealth.org', '1mg.com', 'pharmeasy.in',
        'netmeds.com', 'medlife.com', 'apollopharmacy.in', 'medplusindia.com'
    ],
    'FUEL': [
        'petrol', 'diesel', 'fuel', 'gas station', 'hp', 'indian oil', 
        'bharat petroleum', 'shell', 'reliance', 'essar', 'nayara', 'cng', 'lpg',
        'pump', 'filling', 'hpcl', 'bpcl', 'iocl', 'petroleum',
        'hindustan petroleum', 'bharat petroleum', 'indian oil', 'shell.in',
        'reliancepetroleum.com', 'nayaraenergy.com'
    ],
    'INSURANCE': [
        'insurance', 'policy', 'premium', 'lic', 'health insurance', 
        'term insurance', 'life insurance', 'vehicle insurance', 'car insurance',
        'bike insurance', 'motor', 'hdfc ergo', 'icici lombard', 'bajaj allianz',
        'tata aig', 'star health', 'max bupa', 'aditya birla', 'sbi insurance',
        'licindia.in', 'hdfcergo.com', 'icicilombard.com', 'bajajallianz.com',
        'tataaig.com', 'starhealth.in', 'maxbupa.com', 'adityabirlacapital.com'
    ],
    'INVESTMENT': [
        'mutual fund', 'stock', 'broker', 'zerodha', 'groww', 'investment', 
        'sip', 'nps', 'ppf', 'fd', 'rd', 'fixed deposit', 'recurring',
        'demat', 'trading', 'share', 'equity', 'debt', 'fund', 'amc',
        'hdfc securities', 'icici direct', 'kotak securities', 'axis direct',
        'upstox', 'angel one', '5paisa', 'motilal oswal', 'edelweiss',
        'zerodha.com', 'groww.in', 'upstox.com', 'angelone.in', '5paisa.com',
        'hdfcsec.com', 'icicidirect.com', 'kotaksecurities.com', 'axisdirect.in'
    ],
    'RENT': [
        'rent', 'lease', 'housing', 'maintenance', 'society', 'apartment',
        'flat', 'pg', 'hostel', 'accommodation', 'deposit', 'advance',
        'rental', 'landlord', 'tenant', 'housing.com', 'magicbricks', '99acres',
        'housing.com', 'magicbricks.com', '99acres.com', 'nobroker.in',
        'olx.in', 'quikr.com', 'nestaway.com', 'stanza living'
    ],
    'EMI': [
        'emi', 'loan', 'installment', 'mortgage', 'home loan', 'car loan', 
        'personal loan', 'education loan', 'student loan', 'gold loan',
        'bike loan', 'two wheeler', 'consumer loan', 'durables', 'finance',
        'hdfc bank loan', 'sbi loan', 'icici loan', 'axis loan', 'bajaj finserv',
        'bajajfinserv.in', 'hdfcbank.com', 'sbi.co.in', 'icicibank.com',
        'axisbank.com', 'kotak.com', 'indusind.com'
    ],
    'EDUCATION': [
        'school', 'college', 'university', 'course', 'tuition', 'education', 
        'udemy', 'coursera', 'byjus', 'unacademy', 'vedantu', 'whitehat',
        'upgrad', 'simpli', 'skillshare', 'linkedin learning', 'pluralsight',
        'exam', 'test', 'coaching', 'institute', 'academy', 'training',
        'byjus.com', 'unacademy.com', 'vedantu.com', 'udemy.com', 'coursera.org',
        'upgrad.com', 'simplilearn.com', 'skillshare.com', 'linkedin.com/learning'
    ],
    'SUBSCRIPTION': [
        'subscription', 'membership', 'saas', 'hosting', 'domain', 'software',
        'cloud', 'aws', 'azure', 'gcp', 'google cloud', 'dropbox', 'gdrive',
        'microsoft', 'office', 'adobe', 'canva', 'notion', 'slack', 'zoom',
        'grammarly', 'semrush', 'ahrefs', 'mailchimp', 'sendgrid', 'twilio',
        'aws.amazon.com', 'azure.microsoft.com', 'cloud.google.com', 'dropbox.com',
        'microsoft.com', 'adobe.com', 'canva.com', 'notion.so', 'slack.com',
        'zoom.us', 'grammarly.com', 'semrush.com', 'ahrefs.com', 'mailchimp.com'
    ],
    'TRANSFER': [
        'transfer', 'upi', 'neft', 'rtgs', 'imps', 'payment to', 'sent to',
        'received from', 'pay to', 'collect', 'request', 'split', 'settle',
        'refund', 'reversal', 'cashback', 'reward', 'points redemption',
        'wallet', 'paytm', 'phonepe', 'gpay', 'google pay', 'amazon pay',
        'paytm.com', 'phonepe.com', 'google.com/pay', 'amazon.in/pay',
        'bhimupi.org', 'npci.org.in'
    ],
    'GOVERNMENT': [
        'tax', 'gst', 'income tax', 'tds', 'professional tax', 'property tax',
        'municipal', 'government', 'govt', 'passport', 'visa', 'driving',
        'license', 'registration', 'fine', 'penalty', 'court', 'legal',
        'challan', 'traffic', 'police', 'rto', 'mcd', 'bbmp', 'ghmc',
        'incometaxindia.gov.in', 'gst.gov.in', 'passportindia.gov.in',
        'parivahan.gov.in', 'mcdonline.nic.in', 'bbmp.gov.in'
    ],
    'DONATION': [
        'donation', 'charity', 'ngo', 'trust', 'temple', 'mosque', 'church',
        'gurudwara', 'religious', 'spiritual', 'puja', 'hundi', 'daan',
        'help', 'relief', 'fund', 'crowdfunding', 'ketto', 'milap', 'milaap',
        'ketto.org', 'milaap.org', 'impactguru.com', 'giveindia.org',
        'goonj.org', 'helpageindia.org', 'savethechildren.in'
    ],
    'ATM_CASH': [
        'atm', 'cash', 'withdrawal', 'wdl', 'self', 'own account',
        'pos', 'point of sale', 'cash@pos', 'cash withdrawal',
        'atm withdrawal', 'cash wdl', 'self wdl', 'own a/c wdl'
    ]
}

# PRIORITY ORDER - More specific categories first
PRIORITY_ORDER = [
    'EMI', 'INSURANCE', 'INVESTMENT', 'TAX', 'GOVERNMENT',  # Financial first
    'RENT', 'SUBSCRIPTION', 'EDUCATION', 'DONATION',         # Fixed commitments
    'HEALTH', 'FUEL', 'TRAVEL', 'GROCERIES', 'UTILITIES',    # Essential
    'FOOD_DINING', 'SHOPPING', 'ENTERTAINMENT',              # Lifestyle
    'TRANSFER', 'ATM_CASH'                                   # Transactions
]

def categorize_transaction(description):
    """
    Categorize transaction with improved accuracy
    Returns category with minimum 'OTHER' classification
    """
    if not description:
        return 'OTHER'
    
    desc_lower = description.lower().strip()
    
    # Remove common noise words
    noise_words = ['txn', 'transaction', 'purchase', 'payment', 'paid', 'to', 'from', 'by', 'via', 'at', 'on']
    clean_desc = desc_lower
    for noise in noise_words:
        clean_desc = clean_desc.replace(' ' + noise + ' ', ' ')
        clean_desc = clean_desc.replace(noise + ' ', ' ')
    
    # Check for cashback/refund first (these are credits)
    if any(x in desc_lower for x in ['refund', 'reversal', 'cashback', 'reward', 'credit', 'cash back']):
        return 'CASHBACK'
    
    # Check each category in priority order
    for category in PRIORITY_ORDER:
        keywords = CATEGORY_KEYWORDS.get(category, [])
        if any(keyword in clean_desc for keyword in keywords):
            return category
    
    # MERCHANT-SPECIFIC MAPPINGS (for common abbreviations/short names)
    merchant_mappings = {
        # Food
        'zom': 'FOOD_DINING', 'swig': 'FOOD_DINING', 'domi': 'FOOD_DINING',
        'mcd': 'FOOD_DINING', 'kfc': 'FOOD_DINING', 'subw': 'FOOD_DINING',
        'pizz': 'FOOD_DINING', 'biry': 'FOOD_DINING', 'dhab': 'FOOD_DINING',
        'eat': 'FOOD_DINING', 'food': 'FOOD_DINING', 'cafe': 'FOOD_DINING',
        
        # Shopping
        'amzn': 'SHOPPING', 'fkrt': 'SHOPPING', 'flpkrt': 'SHOPPING',
        'mynt': 'SHOPPING', 'ajio': 'SHOPPING', 'nyka': 'SHOPPING',
        'meesh': 'SHOPPING', 'snap': 'SHOPPING', 'flip': 'SHOPPING',
        
        # Travel
        'uber': 'TRAVEL', 'ola': 'TRAVEL', 'rapido': 'TRAVEL',
        'mmt': 'TRAVEL', 'makemytrip': 'TRAVEL', 'goibibo': 'TRAVEL',
        'redbus': 'TRAVEL', 'irctc': 'TRAVEL', 'yatra': 'TRAVEL',
        'ixigo': 'TRAVEL', 'cleartrip': 'TRAVEL', 'easemytrip': 'TRAVEL',
        
        # Entertainment
        'netflix': 'ENTERTAINMENT', 'prime': 'ENTERTAINMENT',
        'hotstar': 'ENTERTAINMENT', 'sony': 'ENTERTAINMENT',
        'zee': 'ENTERTAINMENT', 'spotify': 'ENTERTAINMENT',
        
        # Utilities
        'airtel': 'UTILITIES', 'jio': 'UTILITIES', 'vi': 'UTILITIES',
        'bsnl': 'UTILITIES', 'electricity': 'UTILITIES', 'power': 'UTILITIES',
        'bill': 'UTILITIES', 'recharge': 'UTILITIES',
        
        # Groceries
        'bb': 'GROCERIES', 'basket': 'GROCERIES', 'blinkit': 'GROCERIES',
        'zepto': 'GROCERIES', 'dmart': 'GROCERIES', 'jio mart': 'GROCERIES',
        'grocery': 'GROCERIES', 'supermarket': 'GROCERIES',
        
        # Health
        'apollo': 'HEALTH', 'medplus': 'HEALTH', '1mg': 'HEALTH',
        'pharmeasy': 'HEALTH', 'netmeds': 'HEALTH', 'diagnostic': 'HEALTH',
        'pharmacy': 'HEALTH', 'medical': 'HEALTH', 'hospital': 'HEALTH',
        
        # Finance
        'zerodha': 'INVESTMENT', 'groww': 'INVESTMENT', 'upstox': 'INVESTMENT',
        'hdfc sec': 'INVESTMENT', 'icici direct': 'INVESTMENT',
        'lic': 'INSURANCE', 'hdfc ergo': 'INSURANCE', 'icici lombard': 'INSURANCE',
        
        # Transfers
        'upi': 'TRANSFER', 'paytm': 'TRANSFER', 'phonepe': 'TRANSFER',
        'gpay': 'TRANSFER', 'google pay': 'TRANSFER', 'transfer': 'TRANSFER'
    }
    
    # Check merchant mappings
    for merchant, category in merchant_mappings.items():
        if merchant in clean_desc:
            return category
    
    # AMOUNT-BASED HEURISTICS
    words = clean_desc.split()
    
    # If it's a very short description (1-2 words), try to match partial
    if len(words) <= 2:
        combined = ''.join(words)
        for merchant, category in merchant_mappings.items():
            if merchant in combined or combined in merchant:
                return category
    
    # Check if it looks like a person name (likely transfer)
    if len(words) <= 3 and all(w.isalpha() for w in words if w):
        return 'TRANSFER'
    
    # Check for numbers that look like phone numbers (recharge/bill)
    if re.search(r'\d{10}', desc_lower) or re.search(r'\d{4}[-\s]?\d{4}[-\s]?\d{4}', desc_lower):
        return 'UTILITIES'
    
    # Last resort: OTHER (should be minimal now)
    return 'OTHER'

def detect_international(description, amount_str=''):
    """Detect if transaction is international"""
    if not description:
        return False
    
    desc_lower = description.lower()
    
    intl_indicators = [
        'usd', 'eur', 'gbp', 'aud', 'cad', 'sgd', 'aed', 'sar', 'qar',
        'international', 'intl', 'forex', 'foreign', 'overseas',
        'usa', 'uk', 'london', 'dubai', 'singapore', 'thailand', 'bali',
        'europe', 'america', 'canada', 'australia', 'uae', 'gulf'
    ]
    
    if any(indicator in desc_lower for indicator in intl_indicators):
        return True
    
    amount_str = str(amount_str) if amount_str else ''
    if any(symbol in amount_str for symbol in ['$', '€', '£', 'USD', 'EUR', 'GBP']):
        return True
    
    if any(x in desc_lower for x in ['conversion', 'exchange rate', 'fx', 'cross currency']):
        return True
    
    return False

def analyze_statement(file_path):
    """
    Analyze credit card statement with improved accuracy
    """
    try:
        # Read file with multiple encoding attempts
        if file_path.endswith('.csv'):
            df = None
            for encoding in ['utf-8', 'latin-1', 'iso-8859-1', 'cp1252']:
                try:
                    df = pd.read_csv(file_path, encoding=encoding, on_bad_lines='skip')
                    break
                except UnicodeDecodeError:
                    continue
            if df is None:
                raise Exception("Could not read CSV file with any encoding")
        else:
            df = pd.read_excel(file_path)
    except Exception as e:
        raise Exception(f"Failed to read file: {str(e)}")
    
    # Standardize column names
    df.columns = [col.strip().lower().replace(' ', '_') for col in df.columns]
    
    # Detect columns automatically
    date_col = None
    desc_col = None
    amount_col = None
    type_col = None
    
    for col in df.columns:
        col_lower = col.lower()
        if any(x in col_lower for x in ['date', 'transaction_date', 'txn_date', 'posting_date', 'value_date']):
            date_col = col
        if any(x in col_lower for x in ['desc', 'merchant', 'narration', 'details', 'particulars', 'transaction_details', 'payee', 'counterparty']):
            desc_col = col
        if any(x in col_lower for x in ['amount', 'debit', 'credit', 'transaction_amount', 'txn_amount', 'amount_inr', 'inr']):
            amount_col = col
        if any(x in col_lower for x in ['type', 'dr_cr', 'debit_credit', 'txn_type', 'transaction_type']):
            type_col = col
    
    # Fallback to position-based detection
    if date_col is None and len(df.columns) > 0:
        date_col = df.columns[0]
    if desc_col is None and len(df.columns) > 1:
        desc_col = df.columns[1]
    if amount_col is None and len(df.columns) > 2:
        amount_col = df.columns[2]
    
    transactions = []
    category_totals = {}
    other_count = 0
    total_count = 0
    
    for _, row in df.iterrows():
        try:
            if pd.isna(row[desc_col]) if desc_col else True:
                continue
            
            description = str(row[desc_col]).strip()
            
            # Skip header/total rows
            skip_keywords = ['description', 'narration', 'merchant', 'total', 'opening', 'closing', 
                           'balance', 'summary', 'statement', 'date', 'transaction', 'page']
            if any(x in description.lower() for x in skip_keywords) and len(description) < 50:
                continue
            
            # Parse amount
            amount_str = str(row[amount_col]) if amount_col else '0'
            amount_str = re.sub(r'[^\d.-]', '', amount_str.replace('₹', '').replace('$', '').replace('€', '').replace('£', '').replace(',', ''))
            
            try:
                amount = float(amount_str) if amount_str else 0
            except ValueError:
                continue
            
            if pd.isna(amount) or amount == 0:
                continue
            
            # Determine transaction type
            if type_col and not pd.isna(row[type_col]):
                txn_type = str(row[type_col]).strip().upper()
                if txn_type in ['DR', 'DEBIT', 'D', 'WDL', 'WITHDRAWAL']:
                    txn_type = 'Debit'
                elif txn_type in ['CR', 'CREDIT', 'C', 'DEP', 'DEPOSIT']:
                    txn_type = 'Credit'
                else:
                    txn_type = 'Debit' if amount > 0 else 'Credit'
            else:
                txn_type = 'Debit' if amount > 0 else 'Credit'
            
            amount = abs(amount)
            
            # Categorize with improved logic
            category = categorize_transaction(description)
            is_international = detect_international(description, str(row[amount_col]) if amount_col else '')
            
            # Get date
            date_val = ''
            if date_col and not pd.isna(row[date_col]):
                try:
                    date_obj = pd.to_datetime(row[date_col])
                    date_val = date_obj.strftime('%Y-%m-%d')
                except:
                    date_val = str(row[date_col])
            
            transaction = {
                'date': date_val,
                'description': description,
                'merchant': description[:50] if len(description) > 50 else description,
                'amount': amount,
                'type': txn_type,
                'category': category,
                'isInternational': is_international
            }
            
            transactions.append(transaction)
            total_count += 1
            
            # Track category totals (only for debits)
            if txn_type == 'Debit':
                if category not in category_totals:
                    category_totals[category] = 0
                category_totals[category] += amount
                
                if category == 'OTHER':
                    other_count += 1
            
        except Exception as e:
            continue
    
    # Calculate summary statistics
    total_spend = sum(t['amount'] for t in transactions if t['type'] == 'Debit')
    total_international = sum(t['amount'] for t in transactions if t['isInternational'] and t['type'] == 'Debit')
    total_domestic = total_spend - total_international
    total_credits = sum(t['amount'] for t in transactions if t['type'] == 'Credit')
    
    # Calculate OTHER percentage
    other_percentage = (other_count / max(total_count, 1)) * 100
    
    summary = {
        'total_spend': total_spend,
        'total_domestic': total_domestic,
        'total_international': total_international,
        'total_credits': total_credits,
        'transaction_count': len(transactions),
        'debit_count': len([t for t in transactions if t['type'] == 'Debit']),
        'credit_count': len([t for t in transactions if t['type'] == 'Credit']),
        'category_breakdown': category_totals,
        'other_percentage': round(other_percentage, 2),
        'categorization_accuracy': f"{100 - other_percentage:.1f}%"
    }
    
    return transactions, category_totals, summary