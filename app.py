import os
import smtplib
import random
from email.mime.text import MIMEText
from flask import Flask, render_template, request, jsonify, session
import joblib
import feedparser
from bs4 import BeautifulSoup
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from models import db, User, Article, Saved, Like, Comment, History
import time
from dotenv import load_dotenv

# --- IMPORTS FOR MAXIMUM SPEED TRANSLATION ---
from deep_translator import GoogleTranslator
from concurrent.futures import ThreadPoolExecutor
from functools import lru_cache

# Load the secret variables from the .env file
load_dotenv()

app = Flask(__name__)
app.secret_key = 'super_secret_key_for_sessions'

# --- CONFIGURATION ---
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///fakenews.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = 'static/uploads'

os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

db.init_app(app)
with app.app_context():
    db.create_all()

# ==========================================
# EMAIL CONFIGURATION & ADMIN SETUP
# ==========================================
SENDER_EMAIL = os.getenv("SENDER_EMAIL")
SENDER_PASSWORD = os.getenv("SENDER_PASSWORD")
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL") # The email allowed to see System Users

if not SENDER_EMAIL or not SENDER_PASSWORD:
    print("\n⚠️ WARNING: Missing Email Credentials in .env file!")

# ==========================================
# ULTRA-FAST AI TRANSLATION CACHE
# ==========================================
@lru_cache(maxsize=1000)
def fast_translate(text, target_lang):
    if target_lang == 'en':
        return text
    try:
        return GoogleTranslator(source='auto', target=target_lang).translate(text)
    except Exception:
        return text 

# ==========================================
# 1. LOAD MACHINE LEARNING MODEL
# ==========================================
try:
    model = joblib.load('models/model.pkl')
    vectorizer = joblib.load('models/vectorizer.pkl')
except Exception as e:
    print(f"Model files not found. Please run model_trainer.py. Error: {e}")

# ==========================================
# 2. AUTHENTICATION & PROFILE ROUTES
# ==========================================
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email').lower().strip()
    
    if User.query.filter_by(email=email).first():
        return jsonify({'success': False, 'message': 'Email already exists. Please login.'})

    hashed_pw = generate_password_hash(data.get('password'), method='pbkdf2:sha256')
    new_user = User(full_name=data.get('name'), email=email, password_hash=hashed_pw)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'success': True, 'message': 'Account created successfully! You can now login.'})

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email').lower().strip()
    user = User.query.filter_by(email=email).first()
    
    if user and check_password_hash(user.password_hash, data.get('password')):
        session['user_id'] = user.id
        session['user_name'] = user.full_name
        return jsonify({'success': True, 'name': user.full_name, 'message': 'Login successful!'})
    return jsonify({'success': False, 'message': 'Invalid email or password.'})

@app.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'success': True, 'message': 'Logged out successfully.'})

@app.route('/api/user/profile', methods=['GET'])
def get_profile():
    if 'user_id' not in session: return jsonify({'success': False, 'message': 'Not logged in'})
    user = User.query.get(session['user_id'])
    if user: 
        # Check if the logged-in user matches the ADMIN_EMAIL from the .env file
        is_admin = (user.email == ADMIN_EMAIL)
        return jsonify({
            'success': True, 
            'name': user.full_name, 
            'email': user.email, 
            'joined': user.created_at.strftime("%B %d, %Y"), 
            'is_admin': is_admin
        })
    return jsonify({'success': False})

@app.route('/api/user/update', methods=['POST'])
def update_profile():
    if 'user_id' not in session: return jsonify({'success': False})
    data = request.get_json()
    user = User.query.get(session['user_id'])
    if user:
        if data.get('name'): user.full_name = data.get('name')
        if data.get('email'):
            new_email = data.get('email').lower().strip()
            existing = User.query.filter_by(email=new_email).first()
            if existing and existing.id != user.id:
                return jsonify({'success': False, 'message': 'Email already in use'})
            user.email = new_email
        if data.get('password'): user.password_hash = generate_password_hash(data.get('password'), method='pbkdf2:sha256')
        db.session.commit()
        return jsonify({'success': True, 'message': 'Profile updated!', 'name': user.full_name, 'email': user.email})
    return jsonify({'success': False})

@app.route('/api/request_delete_code', methods=['POST'])
def request_delete_code():
    if 'user_id' not in session: return jsonify({'success': False})
    user = User.query.get(session['user_id'])
    code = str(random.randint(100000, 999999))
    session['delete_code'] = code

    try:
        msg = MIMEText(f"Hello {user.full_name},\n\nYour account deletion verification code is: {code}\n\nIf you did not request this, please ignore this email.")
        msg['Subject'] = "Fake News Detector - Delete Account Verification"
        msg['From'] = SENDER_EMAIL
        msg['To'] = user.email
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        server.send_message(msg)
        server.quit()
        return jsonify({'success': True, 'message': f'Verification code sent to {user.email}'})
    except Exception as e:
        print(f"\n❌ [EMAIL SEND FAILED] Error: {e}")
        print(f"=== MOCK EMAIL SENT TO {user.email} ===")
        print(f"VERIFICATION CODE: {code}\n==================================\n")
        return jsonify({'success': True, 'message': 'Email sent! (Check Server Terminal for code)'})

@app.route('/api/user/delete', methods=['POST'])
def delete_account():
    if 'user_id' not in session: return jsonify({'success': False})
    data = request.get_json()
    if data.get('code') != session.get('delete_code'):
        return jsonify({'success': False, 'message': 'Invalid verification code.'})

    user = User.query.get(session['user_id'])
    if user:
        Saved.query.filter_by(user_id=user.id).delete()
        Like.query.filter_by(user_id=user.id).delete()
        Comment.query.filter_by(user_id=user.id).delete()
        History.query.filter_by(user_id=user.id).delete()
        
        posts = Article.query.filter_by(user_id=user.id).all()
        for post in posts:
            if post.image_url and post.image_url.startswith('/static/uploads/'):
                file_path = post.image_url.lstrip('/') 
                if os.path.exists(file_path):
                    os.remove(file_path)
            db.session.delete(post)
            
        db.session.delete(user)
        db.session.commit()
        session.clear()
        return jsonify({'success': True, 'message': 'Account permanently deleted.'})
    return jsonify({'success': False})

@app.route('/api/users', methods=['GET'])
def get_all_users():
    if 'user_id' not in session: 
        return jsonify({"success": False, "message": "Unauthorized"}), 401
    
    user = User.query.get(session['user_id'])
    
    # STRICT SECURITY: Block if the user is NOT the admin!
    if not user or user.email != ADMIN_EMAIL:
        return jsonify({"success": False, "message": "Admin access required."}), 403

    users = User.query.all()
    formatted_users = [{"id": u.id, "name": u.full_name, "email": u.email, "joined": u.created_at.strftime("%B %d, %Y")} for u in users]
    return jsonify({"success": True, "users": formatted_users, "total": len(formatted_users)})

# ==========================================
# 3. PREDICTION ROUTE
# ==========================================
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    if request.method == 'POST':
        data = request.get_json()
        news_text = data['text']
        transformed_text = vectorizer.transform([news_text])
        probabilities = model.predict_proba(transformed_text)[0]
        
        real_percentage = round(probabilities[1] * 100, 2)
        fake_percentage = round(probabilities[0] * 100, 2)
        
        if 49.0 <= real_percentage <= 51.0: label = "Uncertain"
        elif real_percentage > 51.0: label = "Real"
        else: label = "Fake"
        
        if 'user_id' in session:
            new_history = History(user_id=session['user_id'], scanned_text=news_text, prediction=label, real_score=real_percentage, fake_score=fake_percentage)
            db.session.add(new_history)
            db.session.commit()

        return jsonify({'prediction': label, 'real_score': real_percentage, 'fake_score': fake_percentage})

# ==========================================
# 4. INTERACTIONS (SAVE, LIKE, COMMENT, PUBLISH)
# ==========================================
def get_or_create_article(title, url, image):
    article = Article.query.filter_by(source_url=url).first()
    if not article:
        article = Article(title=title, image_url=image, source_url=url)
        db.session.add(article)
        db.session.commit()
    return article

@app.route('/api/toggle_save', methods=['POST'])
def toggle_save():
    if 'user_id' not in session: return jsonify({'success': False, 'message': 'Please login to save.'})
    data = request.get_json()
    article = get_or_create_article(data['title'], data['url'], data['image'])

    existing = Saved.query.filter_by(user_id=session['user_id'], article_id=article.id).first()
    if existing: 
        db.session.delete(existing)
        db.session.commit()
        return jsonify({'success': True, 'action': 'unsaved', 'message': 'Removed from Saved.'})
    else:
        db.session.add(Saved(user_id=session['user_id'], article_id=article.id))
        db.session.commit()
        return jsonify({'success': True, 'action': 'saved', 'message': 'Article saved!'})

@app.route('/api/toggle_like', methods=['POST'])
def toggle_like():
    if 'user_id' not in session: return jsonify({'success': False, 'message': 'Please login to like.'})
    data = request.get_json()
    article = get_or_create_article(data['title'], data['url'], data['image'])

    existing = Like.query.filter_by(user_id=session['user_id'], article_id=article.id).first()
    if existing: 
        db.session.delete(existing)
        db.session.commit()
        return jsonify({'success': True, 'action': 'unliked', 'message': 'Unliked'})
    else:
        db.session.add(Like(user_id=session['user_id'], article_id=article.id))
        db.session.commit()
        return jsonify({'success': True, 'action': 'liked', 'message': 'Liked!'})

@app.route('/api/comments', methods=['GET', 'POST'])
def handle_comments():
    if request.method == 'POST':
        if 'user_id' not in session: return jsonify({'success': False, 'message': 'Login required'})
        data = request.get_json()
        article = get_or_create_article(data['title'], data['url'], data['image'])
        new_comment = Comment(user_id=session['user_id'], article_id=article.id, text=data['text'][:150])
        db.session.add(new_comment)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Comment posted!'})
    else:
        url = request.args.get('url')
        article = Article.query.filter_by(source_url=url).first()
        if not article: return jsonify({'comments': []})
        comments = Comment.query.filter_by(article_id=article.id).order_by(Comment.posted_at.desc()).all()
        current_user = session.get('user_id')
        formatted = [{'id': c.id, 'user': c.user.full_name, 'text': c.text, 'date': c.posted_at.strftime("%b %d, %H:%M"), 'is_owner': c.user_id == current_user} for c in comments]
        return jsonify({'comments': formatted})

@app.route('/api/comments/<int:comment_id>', methods=['PUT', 'DELETE'])
def modify_comment(comment_id):
    if 'user_id' not in session: return jsonify({'success': False})
    comment = Comment.query.get(comment_id)
    if not comment or comment.user_id != session['user_id']: return jsonify({'success': False, 'message': 'Unauthorized'})
    if request.method == 'DELETE':
        db.session.delete(comment)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Comment deleted'})
    if request.method == 'PUT':
        data = request.get_json()
        comment.text = data['text'][:150]
        db.session.commit()
        return jsonify({'success': True, 'message': 'Comment updated'})

@app.route('/api/get_saved', methods=['GET'])
def get_saved():
    if 'user_id' not in session: return jsonify({'articles': []})
    saved_items = Saved.query.filter_by(user_id=session['user_id']).order_by(Saved.saved_at.desc()).all()
    formatted_articles = [{"genre": "Saved", "title": item.article.title, "image": item.article.image_url, "url": item.article.source_url, "published": item.saved_at.isoformat() + 'Z'} for item in saved_items]
    return jsonify({"articles": formatted_articles})

@app.route('/api/get_history', methods=['GET'])
def get_history():
    if 'user_id' not in session: return jsonify({'history': []})
    history_items = History.query.filter_by(user_id=session['user_id']).order_by(History.scanned_at.desc()).limit(20).all()
    formatted_history = [{"text": item.scanned_text, "prediction": item.prediction, "real_score": item.real_score, "date": item.scanned_at.strftime("%b %d, %Y - %I:%M %p")} for item in history_items]
    return jsonify({"history": formatted_history})

@app.route('/api/publish_news', methods=['POST'])
def publish_news():
    if 'user_id' not in session: return jsonify({'success': False, 'message': 'Not logged in.'})
    title = request.form.get('title')
    content = request.form.get('content')
    image_file = request.files.get('image')
    image_url = ""
    if image_file and image_file.filename != '':
        filename = secure_filename(f"{int(time.time())}_{image_file.filename}")
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        image_file.save(filepath)
        image_url = f"/{filepath}"

    new_article = Article(title=title, content=content, image_url=image_url, source_url=f"/user_post/{int(time.time())}", is_user_post=True, user_id=session['user_id'])
    db.session.add(new_article)
    db.session.commit()
    return jsonify({'success': True, 'message': 'News published successfully!'})

@app.route('/api/get_my_posts', methods=['GET'])
def get_my_posts():
    if 'user_id' not in session: return jsonify({'articles': []})
    posts = Article.query.filter_by(user_id=session['user_id'], is_user_post=True).order_by(Article.created_at.desc()).all()
    formatted_posts = [{"id": p.id, "genre": "My Post", "title": p.title, "content": p.content, "image": p.image_url, "url": p.source_url, "published": p.created_at.isoformat() + 'Z'} for p in posts]
    return jsonify({"articles": formatted_posts})

@app.route('/api/delete_post/<int:post_id>', methods=['DELETE'])
def delete_post(post_id):
    if 'user_id' not in session: return jsonify({'success': False})
    post = Article.query.filter_by(id=post_id, user_id=session['user_id']).first()
    if post:
        if post.image_url and post.image_url.startswith('/static/uploads/'):
            file_path = post.image_url.lstrip('/') 
            if os.path.exists(file_path):
                os.remove(file_path)
        Saved.query.filter_by(article_id=post.id).delete() 
        Like.query.filter_by(article_id=post.id).delete() 
        Comment.query.filter_by(article_id=post.id).delete() 
        db.session.delete(post)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Post deleted.'})
    return jsonify({'success': False, 'message': 'Post not found.'})

# ==========================================
# 5. HIGH-SPEED RSS NEWS ROUTE WITH MULTITHREADING
# ==========================================
@app.route('/api/news/<genre>', methods=['GET'])
def get_live_news(genre):
    lang = request.args.get('lang', 'en')
    country = request.args.get('country', 'in').upper()
    query = request.args.get('q', '')
    locale_params = f"?hl={lang}-{country}&gl={country}&ceid={country}:{lang}"
    
    if query: url = f"https://news.google.com/rss/search?q={query}&hl={lang}-{country}&gl={country}&ceid={country}:{lang}"
    else:
        if genre.lower() in ['business', 'technology', 'entertainment', 'sports', 'science', 'health', 'world', 'nation']:
            url = f"https://news.google.com/rss/headlines/section/topic/{genre.upper()}{locale_params}"
        elif genre.lower() in ['economy', 'politics', 'education']:
            url = f"https://news.google.com/rss/search?q={genre.capitalize()}&hl={lang}-{country}&gl={country}&ceid={country}:{lang}"
        else: url = f"https://news.google.com/rss{locale_params}"
            
    try:
        feed = feedparser.parse(url)
        target_lang = 'zh-CN' if lang == 'zh' else lang
        
        # Process a single article so we can Multithread it
        def process_article(entry):
            article_url = entry.link if 'link' in entry else "#"
            published_date = entry.published if 'published' in entry else None
            
            # Fetch translation from the ultra-fast cache
            final_title = fast_translate(entry.title, target_lang)
            
            return {
                "genre": genre.capitalize() if genre not in ['home', 'all'] else "General",
                "title": final_title,
                "image": "", 
                "url": article_url,
                "published": published_date
            }

        # ⚡ MULTITHREADING MAGIC ⚡
        with ThreadPoolExecutor(max_workers=10) as executor:
            formatted_articles = list(executor.map(process_article, feed.entries[:10]))
            
        return jsonify({"articles": formatted_articles})
    except Exception as e:
        print(f"RSS Fetch Error: {e}")
        return jsonify({"articles": []})

if __name__ == '__main__':
    app.run(debug=True)