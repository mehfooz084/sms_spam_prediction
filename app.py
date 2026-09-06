import os
import re
from flask import Flask, request, jsonify, render_template
import joblib

app = Flask(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "svm_model.pkl")
VECT_PATH = os.path.join(BASE_DIR, "tfidf_vectorizer.pkl")

svm_model = None
tfidf_vectorizer = None

try:
    if os.path.exists(MODEL_PATH) and os.path.exists(VECT_PATH):
        svm_model = joblib.load(MODEL_PATH)
        tfidf_vectorizer = joblib.load(VECT_PATH)
except Exception as e:
    print(f"Startup Error: {e}")

def get_message_stats(message):
    return {
        "characters": len(message),
        "words": len(message.split()),
        "digits": len(re.findall(r'\d', message)),
        "uppercase": len(re.findall(r'[A-Z]', message)),
        "special_characters": len(re.findall(r'[^a-zA-Z0-9\s]', message)),
        "urls": len(re.findall(r'(https?://[^\s]+|www\.[^\s]+)', message))
    }

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    if not svm_model or not tfidf_vectorizer:
        return jsonify({"success": False, "error": "Backend Error: Model files missing or failed to load."})

    data = request.get_json()
    if not data or 'message' not in data:
        return jsonify({"success": False, "error": "Invalid request."})

    message = data['message'].strip()
    if not message:
        return jsonify({"success": False, "error": "Please enter an SMS message to scan."})

    try:
        # 1. Transform input using fitted vectorizer
        vectorized_message = tfidf_vectorizer.transform([message])
        
        # 2. Predict using trained SVM
        model_label = svm_model.predict(vectorized_message)[0]
        decision_score = svm_model.decision_function(vectorized_message)[0]
        
        # 3. Format output
        prediction_ui = "SPAM" if model_label == "spam" else "NOT SPAM"
        stats = get_message_stats(message)

        return jsonify({
            "success": True,
            "prediction": prediction_ui,
            "model_label": model_label,
            "decision_score": round(float(decision_score), 4),
            "message_stats": stats
        })

    except Exception as e:
        return jsonify({"success": False, "error": f"An error occurred during prediction: {str(e)}"})

if __name__ == '__main__':
    app.run(debug=True)
