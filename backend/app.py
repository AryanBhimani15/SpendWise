from flask import Flask, request, jsonify, send_from_directory, send_file
from flask_cors import CORS
import os
import sys
import tempfile
import traceback

# Add backend folder to path so imports work
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE_DIR)

# Project root is parent of backend folder
PROJECT_DIR = os.path.dirname(BASE_DIR)

from analyzer import analyze_statement
from ai_insights import generate_ai_insights
from rewards_engine import calculate_rewards, find_best_cards

app = Flask(__name__, static_folder=PROJECT_DIR, static_url_path='')

# Production CORS - restrict to your actual domains in production
CORS(app, resources={
    r"/api/*": {
        "origins": ["https://yourdomain.com", "https://www.yourdomain.com", "http://localhost:8000"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

@app.route('/')
def home():
    return send_file(os.path.join(PROJECT_DIR, 'index.html'))

@app.route('/<path:filename>')
def serve_html(filename):
    """Serve HTML files from root directory"""
    if filename.endswith('.html'):
        file_path = os.path.join(PROJECT_DIR, filename)
        if os.path.exists(file_path):
            return send_file(file_path)
    return "File not found", 404

@app.route('/css/<path:filename>')
def serve_css(filename):
    return send_from_directory(os.path.join(PROJECT_DIR, 'css'), filename)

@app.route('/js/<path:filename>')
def serve_js(filename):
    return send_from_directory(os.path.join(PROJECT_DIR, 'js'), filename)

@app.route('/data/<path:filename>')
def serve_data(filename):
    return send_from_directory(os.path.join(PROJECT_DIR, 'data'), filename)

@app.route('/api/analyze', methods=['POST', 'OPTIONS'])
def analyze():
    # Handle preflight request
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'ok'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response
        
    temp_file_path = None
    
    try:
        if 'file' not in request.files:
            return jsonify({
                "success": False, 
                "error": "No file uploaded. Please select a file."
            }), 400

        file = request.files['file']
        
        if file.filename == '':
            return jsonify({
                "success": False, 
                "error": "No file selected."
            }), 400

        allowed = {'.csv', '.xlsx', '.xls', '.pdf'}
        suffix = os.path.splitext(file.filename)[1].lower()

        if suffix not in allowed:
            return jsonify({
                "success": False, 
                "error": f"Invalid file type '{suffix}'. Allowed: CSV, Excel, PDF"
            }), 400

        if suffix == '.pdf':
            return jsonify({
                "success": False,
                "error": "PDF support coming soon! Please upload CSV or Excel for now."
            }), 400

        # Save to temp file
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            file.save(tmp.name)
            temp_file_path = tmp.name

        print(f"Processing file: {file.filename} ({suffix})")
        
        # Analyze
        transactions, category_totals, summary = analyze_statement(temp_file_path)
        
        print(f"Found {len(transactions)} transactions")
        print(f"Categories: {list(category_totals.keys())}")

        # Generate insights and recommendations
        ai_insights = generate_ai_insights(transactions, summary)
        rewards_analysis = calculate_rewards(category_totals)
        best_cards = find_best_cards(category_totals)

        # Clean up
        if temp_file_path and os.path.exists(temp_file_path):
            os.remove(temp_file_path)

        response = jsonify({
            "success": True,
            "data": {
                "transactions": transactions,
                "totals": summary,
                "category_totals": category_totals,
                "ai_insights": ai_insights,
                "rewards_analysis": rewards_analysis,
                "best_cards": best_cards,
                "file_name": file.filename
            }
        })
        
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response

    except Exception as e:
        if temp_file_path and os.path.exists(temp_file_path):
            os.remove(temp_file_path)
            
        error_msg = str(e)
        print("ERROR:", error_msg)
        traceback.print_exc()
        
        response = jsonify({
            "success": False, 
            "error": f"Analysis failed: {error_msg}"
        }), 500
        
        return response

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "ok",
        "message": "CardMax API is running"
    })

if __name__ == '__main__':
    # Azure sets PORT or defaults to 8000
    port = int(os.environ.get('PORT', 8000))
    app.run(host='0.0.0.0', port=port, debug=False)