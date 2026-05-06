# 📰 Fake News Detector

## Overview
A full-stack web application that utilizes Machine Learning and Natural Language Processing (NLP) to verify the authenticity of live news. The system fetches live global headlines using Google News RSS, analyzes the text via a custom-trained Logistic Regression model, and displays real-time authenticity scores using interactive 3D visualizations.

## 🚀 Technologies Used
* **Frontend:** HTML5, CSS3, Vanilla JavaScript, Bootstrap 5, Highcharts 3D
* **Backend:** Python 3.10, Flask, SQLite, concurrent.futures (Multithreading)
* **Machine Learning:** Scikit-Learn (Logistic Regression, TF-IDF), Pandas, Joblib

## ⚙️ Features
* Real-time RSS news fetching with multi-threaded performance.
* Custom NLP model trained offline, capable of identifying fabricated text.
* Dynamic UI that updates without page reloads.
* Client-side language translation integration.

## 📸 Screenshots
<img width="1366" height="643" alt="image" src="https://github.com/user-attachments/assets/ca7897c8-4364-4d0a-a619-a27bc464c475" />
<img width="1366" height="638" alt="image" src="https://github.com/user-attachments/assets/0f2fc76f-096f-406e-93b1-bf2381dfb68c" />
<img width="1366" height="639" alt="image" src="https://github.com/user-attachments/assets/b01ebc39-85b2-44f3-a6a1-d164b0e7d630" />
<img width="1366" height="640" alt="image" src="https://github.com/user-attachments/assets/bd3473f5-1ccf-439e-a320-01967a21a2ba" />

## 🛠️ How to Run Locally
1. Clone this repository: git clone [https://github.com/jenilsavaj14-source/Fake-News-Detector.git](https://github.com/jenilsavaj14-source/Fake-News-Detector.git)
2. Install dependencies: pip install -r requirements.txt
3. Run the Flask server: python app.py
4. Open [http://127.0.0.1:5000](http://127.0.0.1:5000) in your browser.
