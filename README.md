# 📱 SMS Spam Prediction using SVM

A Machine Learning web application that classifies SMS messages as **SPAM** or **NOT SPAM** using **TF-IDF Vectorization** and a **Linear Support Vector Machine (SVM)**.

## 🚀 Live Demo

https://smsspamprediction.vercel.app/

## 🧠 Algorithm

- **TF-IDF (Term Frequency-Inverse Document Frequency)** for text feature extraction
- **Linear Support Vector Machine (LinearSVC)** for classification

## 📊 Model Performance

Evaluated on **1,034 test SMS messages**:

| Metric | Score |
|---|---:|
| Accuracy | **98%** |
| Macro F1 | **0.95** |
| Weighted F1 | **0.98** |

### Class-wise Performance

| Class | Precision | Recall | F1-Score |
|---|---:|---:|---:|
| HAM | 0.98 | 1.00 | 0.99 |
| SPAM | 0.97 | 0.87 | 0.92 |

## ⚙️ Tech Stack

**Python • Scikit-learn • TF-IDF • Linear SVM • Flask • HTML • CSS • JavaScript**

## 🔄 ML Pipeline

```text
SMS Message
     ↓
TF-IDF Vectorization
     ↓
Linear SVM
     ↓
SPAM / NOT SPAM
