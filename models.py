from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

# Initialize the database instance
db = SQLAlchemy()

# 1. USERS TABLE
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships (Allows us to easily fetch a user's data)
    articles = db.relationship('Article', backref='author', lazy=True)
    saved = db.relationship('Saved', backref='user', lazy=True)
    likes = db.relationship('Like', backref='user', lazy=True)
    comments = db.relationship('Comment', backref='user', lazy=True)
    history = db.relationship('History', backref='user', lazy=True)

# 2. ARTICLES TABLE (Holds both User Posts & external RSS news that gets interacted with)
class Article(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    content = db.Column(db.Text, nullable=True) # Text for user posts
    image_url = db.Column(db.String(500), nullable=True)
    source_url = db.Column(db.String(500), unique=True, nullable=True) # Original link for RSS
    is_user_post = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Foreign Key: Which user posted this? (If it's a user post)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)

    # Relationships
    saved_by = db.relationship('Saved', backref='article', lazy=True)
    likes = db.relationship('Like', backref='article', lazy=True)
    comments = db.relationship('Comment', backref='article', lazy=True)

# 3. SAVED (BOOKMARKS) TABLE
class Saved(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    article_id = db.Column(db.Integer, db.ForeignKey('article.id'), nullable=False)
    saved_at = db.Column(db.DateTime, default=datetime.utcnow)

# 4. LIKES TABLE
class Like(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    article_id = db.Column(db.Integer, db.ForeignKey('article.id'), nullable=False)
    liked_at = db.Column(db.DateTime, default=datetime.utcnow)

# 5. COMMENTS TABLE
class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    article_id = db.Column(db.Integer, db.ForeignKey('article.id'), nullable=False)
    posted_at = db.Column(db.DateTime, default=datetime.utcnow)

# 6. AI ANALYSIS HISTORY TABLE
class History(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    scanned_text = db.Column(db.Text, nullable=False)
    prediction = db.Column(db.String(20), nullable=False) # Real, Fake, or Uncertain
    real_score = db.Column(db.Float, nullable=False)
    fake_score = db.Column(db.Float, nullable=False)
    scanned_at = db.Column(db.DateTime, default=datetime.utcnow)