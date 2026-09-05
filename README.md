# 🛡️ SMS Spam Detection using SVM

An NLP-based SMS Spam Detection web application that uses **TF-IDF feature extraction** and a **Linear Support Vector Machine (SVM)** to classify SMS messages as **SPAM** or **NOT SPAM**.

The trained machine learning model is integrated into a **Flask web application** with an interactive cybersecurity-themed interface.

## 🚀 Live Demo

**[Try SMS Spam Detector](https://smsspamprediction.vercel.app/)**

---

## 📌 Project Overview

SMS spam is a common form of unwanted communication that can contain fraudulent offers, malicious links, fake rewards, and other suspicious content.

This project uses Natural Language Processing (NLP) and Machine Learning to automatically classify SMS messages.

The prediction pipeline is:

```text
SMS Message
     ↓
Text Preprocessing
     ↓
TF-IDF Vectorization
     ↓
Linear SVM
     ↓
SPAM / NOT SPAM
