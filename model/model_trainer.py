import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
import joblib
import os

# 1. Ensure the 'models' directory exists so we don't get an error
os.makedirs('models', exist_ok=True)

print("Step 1: Loading dataset...")
# DUMMY DATASET for testing purposes.
# Once you download a real dataset, delete this dictionary and use:
# df = pd.read_csv('your_downloaded_dataset.csv')
data = {
    'text': [
        "Aliens landed in New York today and stole the Statue of Liberty.", # Fake
        "The central bank announced a slight increase in interest rates.",  # Real
        "Eating raw garlic every day makes you immortal and fly.",          # Fake
        "Local city council passed a new bill to repair road potholes."     # Real
    ],
    'label': [0, 1, 0, 1] # 0 = Fake, 1 = Real
}
df = pd.DataFrame(data)

print("Step 2: Vectorizing the text data...")
vectorizer = TfidfVectorizer(stop_words='english')
X = vectorizer.fit_transform(df['text'])
y = df['label']

print("Step 3: Training the Logistic Regression Model...")
model = LogisticRegression()
model.fit(X, y)

print("Step 4: Saving files to the /models folder...")
joblib.dump(model, 'models/model.pkl')
joblib.dump(vectorizer, 'models/vectorizer.pkl')

print("✅ Success! model.pkl and vectorizer.pkl have been created.")