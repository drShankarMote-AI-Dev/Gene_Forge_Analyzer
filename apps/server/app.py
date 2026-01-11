import os
import random
import datetime
from flask import Flask, request, jsonify, make_response, redirect, Response
from flask_cors import CORS
from flask_socketio import SocketIO, emit, join_room, leave_room
from flask_jwt_extended import (
    JWTManager, create_access_token, create_refresh_token,
    set_access_cookies, set_refresh_cookies, unset_jwt_cookies,
    jwt_required, get_jwt_identity, decode_token
)
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from flask_sqlalchemy import SQLAlchemy
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from dotenv import load_dotenv
from authlib.integrations.flask_client import OAuth
from flask_mail import Mail, Message
from encryption_utils import encrypt_data, decrypt_data
from ai_engine import ai_bio_engine
import binascii
import json

load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), '.env'))

app = Flask(__name__)

# Configuration
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key')
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///geneforge.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# JWT Configuration
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'jwt-dev-secret')
app.config['JWT_TOKEN_LOCATION'] = ['cookies']
app.config['JWT_ACCESS_COOKIE_PATH'] = '/api/'
app.config['JWT_REFRESH_COOKIE_PATH'] = '/api/auth/refresh'
app.config['JWT_COOKIE_CSRF_PROTECT'] = False
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = datetime.timedelta(minutes=60)
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = datetime.timedelta(days=30)
app.config['JWT_COOKIE_SECURE'] = False  # Set to True in production
app.config['JWT_COOKIE_SAMESITE'] = 'Lax'

# Email Configuration (Mapped to PROD_AUTH_VERCEL spec)
app.config['MAIL_SERVER'] = os.environ.get('EMAIL_HOST', 'smtp.gmail.com')
app.config['MAIL_PORT'] = int(os.environ.get('EMAIL_PORT', 587))
app.config['MAIL_USE_TLS'] = os.environ.get('EMAIL_USE_TLS', 'True') == 'True'
app.config['MAIL_USERNAME'] = os.environ.get('EMAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.environ.get('EMAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.environ.get('EMAIL_FROM', ('Gene Forge Analyzer', 'noreply@geneforge.com'))

db = SQLAlchemy(app)
jwt = JWTManager(app)
mail = Mail(app)
# Multi-origin CORS support for development and production
frontend_url = os.environ.get('FRONTEND_URL', 'http://localhost:8080')
allowed_origins = [frontend_url, "http://localhost:8080", "http://localhost:8081", "http://localhost:5173", "http://localhost:3000"]

socketio = SocketIO(app, cors_allowed_origins=allowed_origins, manage_session=False)
CORS(app, supports_credentials=True, origins=allowed_origins)

# Rate Limiting: 5 requests per minute as per requirements
limiter = Limiter(
    key_func=get_remote_address,
    app=app,
    default_limits=["50 per day", "5 per minute"],
    storage_uri="memory://"
)

# OAuth Setup
google_client_id = os.environ.get('GOOGLE_CLIENT_ID')
google_client_secret = os.environ.get('GOOGLE_CLIENT_SECRET')

if not google_client_id or google_client_id == 'your-google-client-id':
    print("WARNING: GOOGLE_CLIENT_ID is not configured. Google Login will fail.")

oauth = OAuth(app)
oauth.register(
    name='google',
    client_id=google_client_id,
    client_secret=google_client_secret,
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={'scope': 'openid email profile'}
)

# Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    role = db.Column(db.String(20), default='user')
    salt = db.Column(db.LargeBinary, nullable=False)
    password_hash = db.Column(db.String(256), nullable=True) # For Admin Password
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

from werkzeug.security import generate_password_hash, check_password_hash

# ... (Previous code)

@app.route('/api/auth/admin/login', methods=['POST'])
@limiter.limit("5 per minute")
def admin_login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({"msg": "Email and password required"}), 400
        
    user = User.query.filter_by(email=email).first()
    
    if not user or user.role != 'admin' or not user.password_hash:
        # Anti-timing attack (always check something)
        check_password_hash('dummy', 'dummy')
        log_action("ADMIN_LOGIN_FAIL", details=f"Failed attempt for {email}")
        return jsonify({"msg": "Invalid admin credentials"}), 401
        
    if check_password_hash(user.password_hash, password):
        access_token = create_access_token(identity=email)
        refresh_token = create_refresh_token(identity=email)
        resp = jsonify({"msg": "Admin Access Granted", "user": {"email": email, "role": "admin"}})
        set_access_cookies(resp, access_token)
        set_refresh_cookies(resp, refresh_token)
        log_action("ADMIN_LOGIN_SUCCESS", user_id=user.id, details="Password Auth")
        return resp, 200
    else:
        log_action("ADMIN_LOGIN_FAIL", user_id=user.id, details="Wrong Password")
        return jsonify({"msg": "Invalid credentials"}), 401

@app.route('/api/auth/admin/reset-password-request', methods=['POST'])
def admin_reset_request():
    data = request.get_json()
    email = data.get('email')
    
    user = User.query.filter_by(email=email).first()
    if not user or user.role != 'admin':
        # Silent failure to prevent enumeration
        return jsonify({"msg": "If this is a valid admin email, a reset link has been sent."}), 200
        
    # Generate a temporary reset token (using same OTP mechanism for simplicity but specific purpose)
    reset_code = f"{random.randint(100000, 999999)}"
    expiry = datetime.datetime.utcnow() + datetime.timedelta(minutes=15)
    
    # Store in OTP table with special flag/convention? 
    # Or just generic OTP is fine, but we need to know it's for password reset.
    # Let's use the OTP table but verify it via a specific endpoint that allows password reset.
    # Actually, let's just email them a link with a JWT token for reset?
    # Simpler: Send a Code.
    
    new_otp = OTP(email=email, code=reset_code, expiry=expiry)
    db.session.add(new_otp)
    db.session.commit()
    
    try:
        msg = Message("Admin Password Reset - Gene Forge", recipients=[email])
        msg.body = f"Your Admin Password Reset Code is: {reset_code}"
        mail.send(msg)
    except Exception as e:
        print(f"FAILED TO SEND ADMIN RESET: {e}")
        # Still show code in console for dev
        print(f"DEV ADMIN RESET CODE FOR {email}: {reset_code}")
        
    return jsonify({"msg": "If this is a valid admin email, a reset link has been sent."}), 200

@app.route('/api/auth/admin/reset-password-confirm', methods=['POST'])
def admin_reset_confirm():
    data = request.get_json()
    email = data.get('email')
    code = data.get('code')
    new_password = data.get('new_password')
    
    otp = OTP.query.filter_by(email=email, code=code, used=False).first()
    if not otp or otp.expiry < datetime.datetime.utcnow():
        return jsonify({"msg": "Invalid or expired code"}), 400
        
    user = User.query.filter_by(email=email).first()
    if not user or user.role != 'admin':
        return jsonify({"msg": "Unauthorized"}), 403
        
    otp.used = True
    user.password_hash = generate_password_hash(new_password)
    db.session.commit()
    
    return jsonify({"msg": "Password updated successfully"}), 200

@app.route('/api/auth/admin/change-password', methods=['POST'])
@limiter.limit("5 per minute")
def admin_change_password():
    data = request.get_json()
    email = data.get('email')
    old_password = data.get('old_password')
    new_password = data.get('new_password')
    
    if not email or not old_password or not new_password:
        return jsonify({"msg": "All fields required"}), 400
        
    user = User.query.filter_by(email=email).first()
    if not user or user.role != 'admin':
        # Don't reveal user existence
        return jsonify({"msg": "Invalid credentials"}), 401
        
    if not user.password_hash or not check_password_hash(user.password_hash, old_password):
        log_action("ADMIN_PASS_CHANGE_FAIL", user_id=user.id, details="Wrong Old Password")
        return jsonify({"msg": "Invalid old password"}), 401
        
    user.password_hash = generate_password_hash(new_password)
    db.session.commit()
    log_action("ADMIN_PASS_CHANGE_SUCCESS", user_id=user.id, details="Password Updated via Old Pass")
    
    return jsonify({"msg": "Password updated successfully"}), 200

@app.route('/api/admin/system-stats', methods=['GET'])
@jwt_required()
def admin_system_stats():
    email = get_jwt_identity()
    user = User.query.filter_by(email=email).first()
    
    if not user or user.role != 'admin':
        return jsonify({"msg": "Unauthorized"}), 403
        
    user_count = User.query.count()
    project_count = Project.query.count()
    
    # Fetch recent audit logs
    logs = AuditLog.query.order_by(AuditLog.timestamp.desc()).limit(10).all()
    log_data = [{
        "id": l.id,
        "action": l.action,
        "details": l.details,
        "ip": l.ip_address,
        "timestamp": l.timestamp.isoformat(),
        "user_email": User.query.get(l.user_id).email if l.user_id else "System"
    } for l in logs]
    
    return jsonify({
        "users": user_count,
        "projects": project_count,
        "logs": log_data
    }), 200

class GenomicData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    data_type = db.Column(db.String(50), nullable=False) # raw_sequence, analysis_result, ai_report
    encrypted_payload = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(200), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    analyses = db.relationship('AnalysisSession', backref='project', lazy=True, cascade="all, delete-orphan")

class AnalysisSession(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('project.id'), nullable=False)
    encrypted_sequence = db.Column(db.Text, nullable=False)
    encrypted_results = db.Column(db.Text, nullable=True) # JSON stored as encrypted string
    version = db.Column(db.Integer, default=1)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

class OTP(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), nullable=False)
    code = db.Column(db.String(6), nullable=False)
    expiry = db.Column(db.DateTime, nullable=False)
    used = db.Column(db.Boolean, default=False)

class AuditLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    action = db.Column(db.String(100), nullable=False)
    details = db.Column(db.Text, nullable=True)
    ip_address = db.Column(db.String(45), nullable=True)
    timestamp = db.Column(db.DateTime, default=datetime.datetime.utcnow)

class AIUsage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    model_used = db.Column(db.String(50), nullable=False)
    tokens_input = db.Column(db.Integer, default=0)
    tokens_output = db.Column(db.Integer, default=0)
    status = db.Column(db.String(20), default='success') # success, failed, fallback
    timestamp = db.Column(db.DateTime, default=datetime.datetime.utcnow)

def log_action(action, user_id=None, details=None):
    try:
        log = AuditLog(
            user_id=user_id,
            action=action,
            details=details,
            ip_address=request.remote_addr
        )
        db.session.add(log)
        db.session.commit()
    except Exception as e:
        print(f"Audit Log Error: {e}")

with app.app_context():
    db.create_all()
    
    # Seed Admin from Env (Runs on App Startup/Import)
    admin_email = os.environ.get('ADMIN_EMAIL')
    admin_pass = os.environ.get('ADMIN_PASSWORD')
    if admin_email and admin_pass:
        try:
            admin = User.query.filter_by(email=admin_email).first()
            if not admin:
                print(f"Creating Admin User: {admin_email}")
                salt = os.urandom(16)
                admin = User(email=admin_email, role='admin', salt=salt)
                admin.password_hash = generate_password_hash(admin_pass)
                db.session.add(admin)
                db.session.commit()
            else:
                # Always ensure the admin password in DB matches the ENV variable
                if admin.role != 'admin' or not admin.password_hash or not check_password_hash(admin.password_hash, admin_pass):
                    admin.role = 'admin'
                    admin.password_hash = generate_password_hash(admin_pass)
                    db.session.commit()
                    print(f"Updated Admin User credentials from Environment: {admin_email}")
        except Exception as e:
            print(f"Admin seeding error: {e}")

# Routes
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.datetime.utcnow().isoformat(),
        "database": "connected" # Simplified for now
    }), 200

@app.route('/api/auth/otp/send', methods=['POST'])
@limiter.limit("10 per minute") # Increased for easier development
def send_otp():
    data = request.get_json()
    email = data.get('email')
    if not email:
        return jsonify({"msg": "Email is required"}), 400

    # Generate 6-digit OTP
    code = f"{random.randint(100000, 999999)}"
    expiry = datetime.datetime.utcnow() + datetime.timedelta(minutes=5) # Production: 5-minute expiry

    try:
        # Save to database
        new_otp = OTP(email=email, code=code, expiry=expiry)
        db.session.add(new_otp)
        db.session.commit() # Restore commit

        # Real-world email delivery
        try:
            msg = Message(
                "Your Gene Forge Access Passcode",
                recipients=[email]
            )
            msg.body = f"Hello,\n\nYour secure access passcode for Gene Forge Analyzer is: {code}\n\nThis code will expire in 10 minutes.\n\nBest regards,\nThe Gene Forge Security Team"
            msg.html = f"""
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #2563eb; text-align: center;">Gene Forge Analyzer</h2>
                <div style="background: #f8fafc; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
                    <p style="font-size: 14px; color: #64748b; margin-bottom: 10px;">Your secure access passcode</p>
                    <h1 style="font-size: 40px; font-weight: 800; letter-spacing: 5px; color: #0f172a; margin: 0;">{code}</h1>
                    <p style="font-size: 12px; color: #94a3b8; margin-top: 10px;">Expires in 10 minutes</p>
                </div>
                <p style="font-size: 14px; color: #334155; line-height: 1.5;">
                    Enter this code on the authentication screen to initialize your secure session.
                </p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="font-size: 11px; color: #94a3b8; text-align: center;">
                    &copy; 2026 Gene Forge Research Laboratory. All rights reserved.
                </p>
            </div>
            """
            mail.send(msg)
            print(f"DEBUG: Email sent successfully to {email}")
        except Exception as e:
            # Check if it's a configuration error
            is_configured = os.environ.get('EMAIL_USERNAME') and os.environ.get('EMAIL_PASSWORD') and "your_gmail" not in os.environ.get('EMAIL_USERNAME')
            if not is_configured:
                print(f"WARNING: Email NOT SENT to {email} because MAIL_USERNAME/PASSWORD are not set in .env")
            else:
                print(f"CRITICAL: Failed to send email to {email}: {str(e)}")
            
            # In development, we still allow success even if email fails
            if not (os.environ.get('NODE_ENV') == 'development' or app.debug):
                return jsonify({"msg": "Failed to send email. Service temporarily unavailable."}), 503

        is_email_configured = os.environ.get('EMAIL_USERNAME') and "your_gmail" not in os.environ.get('EMAIL_USERNAME') and os.environ.get('EMAIL_PASSWORD') and "your_app_password" not in os.environ.get('EMAIL_PASSWORD')
        
        response_data = {
            "msg": "OTP generated successfully.",
            "email_sent": is_email_configured
        }
        
        # Check environment - force development mode if not specified or in debug
        is_dev = os.environ.get('NODE_ENV') == 'development' or app.debug
        
        if is_dev:
            # We still log the code to console so the user can see it if they haven't set up SMTP
            print(f"|-----------------------------------------|")
            print(f"| DEV PASSCODE FOR {email}: {code} |")
            print(f"|-----------------------------------------|")
            
        return jsonify(response_data), 200
    except Exception as e:
        db.session.rollback()
        print(f"ERROR in send_otp: {str(e)}")
        return jsonify({"msg": "Failed to generate OTP. Internal server error."}), 500

@app.route('/api/auth/otp/verify', methods=['POST'])
@limiter.limit("5 per minute")
def verify_otp():
    data = request.get_json()
    email = data.get('email')
    code = data.get('code')

    if not email or not code:
        return jsonify({"msg": "Email and code are required"}), 400

    otp_record = OTP.query.filter_by(email=email, code=code, used=False).order_by(OTP.expiry.desc()).first()

    if not otp_record or otp_record.expiry < datetime.datetime.utcnow():
        log_action("AUTH_FAILED", details=f"Invalid/Expired OTP attempt for {email}")
        return jsonify({"msg": "Invalid or expired OTP"}), 401

    otp_record.used = True
    
    # Check if user exists, if not create
    user = User.query.filter_by(email=email).first()
    if not user:
        # Generate a unique salt for this user
        salt = os.urandom(16)
        user = User(email=email, salt=salt)
        db.session.add(user)
    
    db.session.commit()

    # Create tokens
    access_token = create_access_token(identity=email)
    refresh_token = create_refresh_token(identity=email)

    resp = jsonify({"msg": "Login successful", "user": {"email": email, "role": user.role}})
    set_access_cookies(resp, access_token)
    set_refresh_cookies(resp, refresh_token)
    log_action("LOGIN_SUCCESS", user_id=user.id, details="OTP Authentication")
    
    return resp, 200

@app.route('/api/auth/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    identity = get_jwt_identity()
    access_token = create_access_token(identity=identity)
    resp = jsonify({"msg": "Token refreshed"})
    set_access_cookies(resp, access_token)
    return resp, 200

@app.route('/api/auth/session', methods=['GET'])
@jwt_required(optional=True)
def get_session():
    identity = get_jwt_identity()
    if identity:
        user = User.query.filter_by(email=identity).first()
        return jsonify({
            "logged_in": True,
            "user": {"email": user.email, "role": user.role}
        }), 200
    return jsonify({"logged_in": False}), 200

@app.route('/api/auth/logout', methods=['POST'])
def logout():
    resp = jsonify({"msg": "Logout successful"})
    unset_jwt_cookies(resp)
    return resp, 200

@app.route('/api/auth/google/verify-token', methods=['POST'])
def google_verify_token():
    data = request.get_json()
    token = data.get('token')
    
    if not token:
        return jsonify({"msg": "No token provided"}), 400
        
    try:
        # Verify the ID token from the frontend
        idinfo = id_token.verify_oauth2_token(token, google_requests.Request(), google_client_id)
        
        email = idinfo['email']
        user = User.query.filter_by(email=email).first()
        if not user:
            # Generate a unique salt for this user
            salt = os.urandom(16)
            user = User(email=email, salt=salt)
            db.session.add(user)
            db.session.commit()
            
        access_token = create_access_token(identity=email)
        refresh_token = create_refresh_token(identity=email)
        
        resp = jsonify({"msg": "Login successful", "user": {"email": email, "role": user.role}})
        set_access_cookies(resp, access_token)
        set_refresh_cookies(resp, refresh_token)
        log_action("LOGIN_SUCCESS", user_id=user.id, details="Google Token Verification")
        return resp
        
    except ValueError as e:
        # Invalid token
        print(f"Token verification error: {str(e)}")
        return jsonify({"msg": "Invalid Google token"}), 401
    except Exception as e:
        print(f"Unexpected OAuth error: {str(e)}")
        return jsonify({"msg": "Internal server error during OAuth"}), 500

@app.route('/api/auth/google/login')
def google_login():
    # Use the server's own URL for the callback instead of the frontend URL if using server-side flow
    base_url = request.host_url.rstrip('/')
    redirect_uri = f"{base_url}/api/auth/google/callback"
    return oauth.google.authorize_redirect(redirect_uri)

@app.route('/api/auth/google/callback')
def google_callback():
    try:
        token = oauth.google.authorize_access_token()
        user_info = token.get('userinfo')
        if user_info:
            email = user_info['email']
            user = User.query.filter_by(email=email).first()
            if not user:
                salt = os.urandom(16)
                user = User(email=email, salt=salt)
                db.session.add(user)
                db.session.commit()
            
            access_token = create_access_token(identity=email)
            refresh_token = create_refresh_token(identity=email)
            
            # Redirect to frontend with success
            frontend_url = os.environ.get('FRONTEND_URL', 'http://localhost:8080')
            resp = make_response(redirect(f"{frontend_url}/analysis"))
            set_access_cookies(resp, access_token)
            set_refresh_cookies(resp, refresh_token)
            log_action("LOGIN_SUCCESS", user_id=user.id, details="Google OAuth Redirect")
            return resp
    except Exception as e:
        print(f"Callback error: {str(e)}")
        
    return jsonify({"msg": "Google login failed"}), 400

# Secure Genomic Data Storage
@app.route('/api/genomic-data', methods=['POST'])
@jwt_required()
def save_genomic_data():
    email = get_jwt_identity()
    user = User.query.filter_by(email=email).first()
    data = request.get_json()
    
    title = data.get('title', 'Untitled Analysis')
    data_type = data.get('data_type')
    payload = data.get('payload') # This is the sensitive plaintext
    
    if not payload or not data_type:
        return jsonify({"msg": "Missing data payload or type"}), 400
        
    # Encrypt the payload before storing
    encrypted = encrypt_data(payload, user.email, user.salt)
    
    new_entry = GenomicData(
        user_id=user.id,
        title=title,
        data_type=data_type,
        encrypted_payload=encrypted
    )
    db.session.add(new_entry)
    db.session.commit()
    
    log_action("DATA_SAVE", user_id=user.id, details=f"Type: {data_type}, Title: {title}")
    
    return jsonify({"msg": "Data saved securely with AES-256-GCM encryption", "id": new_entry.id}), 201

@app.route('/api/genomic-data', methods=['GET'])
@jwt_required()
def list_genomic_data():
    email = get_jwt_identity()
    user = User.query.filter_by(email=email).first()
    
    entries = GenomicData.query.filter_by(user_id=user.id).all()
    return jsonify([{
        "id": e.id,
        "title": e.title,
        "data_type": e.data_type,
        "created_at": e.created_at.isoformat()
    } for e in entries]), 200

@app.route('/api/genomic-data/<int:data_id>', methods=['GET'])
@jwt_required()
def fetch_genomic_data(data_id):
    email = get_jwt_identity()
    user = User.query.filter_by(email=email).first()
    
    entry = GenomicData.query.filter_by(id=data_id, user_id=user.id).first()
    if not entry:
        return jsonify({"msg": "Data not found"}), 404
        
    # Decrypt only for the owner
    decrypted_payload = decrypt_data(entry.encrypted_payload, user.email, user.salt)
    
    return jsonify({
        "id": entry.id,
        "title": entry.title,
        "data_type": entry.data_type,
        "payload": decrypted_payload,
        "created_at": entry.created_at.isoformat(),
        "encrypted": True
    }), 200

# Project Management Routes
@app.route('/api/projects', methods=['POST'])
@jwt_required()
def create_project():
    email = get_jwt_identity()
    user = User.query.filter_by(email=email).first()
    data = request.get_json()
    name = data.get('name', 'New Project')
    
    new_project = Project(user_id=user.id, name=name)
    db.session.add(new_project)
    db.session.commit()
    return jsonify({"msg": "Project created", "id": new_project.id}), 201

@app.route('/api/projects', methods=['GET'])
@jwt_required()
def list_projects():
    email = get_jwt_identity()
    user = User.query.filter_by(email=email).first()
    projects = Project.query.filter_by(user_id=user.id).all()
    return jsonify([{
        "id": p.id,
        "name": p.name,
        "created_at": p.created_at.isoformat(),
        "analysis_count": len(p.analyses)
    } for p in projects]), 200

@app.route('/api/projects/<int:project_id>', methods=['DELETE'])
@jwt_required()
def delete_project(project_id):
    email = get_jwt_identity()
    user = User.query.filter_by(email=email).first()
    project = Project.query.filter_by(id=project_id, user_id=user.id).first()
    if not project:
        return jsonify({"msg": "Project not found"}), 404
    
    db.session.delete(project)
    db.session.commit()
    return jsonify({"msg": "Project and all history deleted"}), 200

@app.route('/api/projects/<int:project_id>/analysis', methods=['POST'])
@jwt_required()
def save_analysis_version(project_id):
    email = get_jwt_identity()
    user = User.query.filter_by(email=email).first()
    project = Project.query.filter_by(id=project_id, user_id=user.id).first()
    if not project:
        return jsonify({"msg": "Project not found"}), 404
        
    data = request.get_json()
    sequence = data.get('sequence')
    results = data.get('results', {})
    
    if not sequence:
        return jsonify({"msg": "Sequence is required"}), 400
        
    # Encrypt data
    enc_seq = encrypt_data(sequence, user.email, user.salt)
    enc_res = encrypt_data(json.dumps(results), user.email, user.salt)
    
    # Get latest version
    latest = AnalysisSession.query.filter_by(project_id=project_id).order_by(AnalysisSession.version.desc()).first()
    new_version = (latest.version + 1) if latest else 1
    
    new_analysis = AnalysisSession(
        project_id=project_id,
        encrypted_sequence=enc_seq,
        encrypted_results=enc_res,
        version=new_version
    )
    db.session.add(new_analysis)
    db.session.commit()
    
    return jsonify({"msg": "Analysis version saved", "version": new_version}), 201

@app.route('/api/projects/<int:project_id>/analysis', methods=['GET'])
@jwt_required()
def get_analysis_history(project_id):
    email = get_jwt_identity()
    user = User.query.filter_by(email=email).first()
    project = Project.query.filter_by(id=project_id, user_id=user.id).first()
    if not project:
        return jsonify({"msg": "Project not found"}), 404
        
    analyses = AnalysisSession.query.filter_by(project_id=project_id).order_by(AnalysisSession.version.desc()).all()
    return jsonify([{
        "id": a.id,
        "version": a.version,
        "created_at": a.created_at.isoformat()
    } for a in analyses]), 200

@app.route('/api/analysis/<int:analysis_id>', methods=['GET'])
@jwt_required()
def get_specific_analysis(analysis_id):
    email = get_jwt_identity()
    user = User.query.filter_by(email=email).first()
    
    # Join with Project to check ownership
    analysis = AnalysisSession.query.join(Project).filter(
        AnalysisSession.id == analysis_id,
        Project.user_id == user.id
    ).first()
    
    if not analysis:
        return jsonify({"msg": "Analysis not found"}), 404
        
    # Decrypt
    dec_seq = decrypt_data(analysis.encrypted_sequence, user.email, user.salt)
    dec_res = json.loads(decrypt_data(analysis.encrypted_results, user.email, user.salt) or "{}")
    
    return jsonify({
        "id": analysis.id,
        "project_id": analysis.project_id,
        "version": analysis.version,
        "sequence": dec_seq,
        "results": dec_res,
        "created_at": analysis.created_at.isoformat()
    }), 200

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy"}), 200

# WebSocket Events for Encrypted Chat
@socketio.on('join')
def on_join(data):
    room = data.get('room')
    if room:
        join_room(room)
        emit('status', {'msg': f'User joined room: {room}'}, room=room)

@socketio.on('leave')
def on_leave(data):
    room = data.get('room')
    if room:
        leave_room(room)

@socketio.on('message')
def handle_message(data):
    # Data is expected to be encrypted on client side (E2EE)
    # The server only relays the blob to the specific room
    room = data.get('room')
    if room:
        emit('message', {
            'sender': data.get('sender'),
            'encrypted_payload': data.get('encrypted_payload'),
            'timestamp': datetime.datetime.utcnow().isoformat(),
            'context': data.get('context') # DNA sequence or result metadata
        }, room=room)

# AI Explanation Engine
@app.route('/api/ai/analyze', methods=['POST'])
@jwt_required()
def ai_analyze():
    data = request.get_json()
    analysis_results = data.get('results')
    mode = data.get('mode', 'researcher')
    
    if not analysis_results:
        return jsonify({"msg": "Missing analysis results"}), 400
        
    explanation = ai_bio_engine.generate_explanation(analysis_results, mode)
    
    email = get_jwt_identity()
    user = User.query.filter_by(email=email).first()
    log_action("AI_ANALYSIS", user_id=user.id, details=f"Mode: {mode}")
    
    return jsonify({"explanation": explanation}), 200

@app.route('/api/ai/usage', methods=['GET'])
@jwt_required()
def ai_usage_stats():
    email = get_jwt_identity()
    user = User.query.filter_by(email=email).first()
    
    # Simple check: only assume user ID 1 is admin, or use role check if role exists
    # For now, allow all logged in users to see their own, or admin to see all.
    # Let's assume role 'admin' exists in User model (it does).
    
    if user.role == 'admin':
        # Join to get email
        results = db.session.query(AIUsage, User.email).join(User, AIUsage.user_id == User.id).order_by(AIUsage.timestamp.desc()).all()
    else:
        results = db.session.query(AIUsage, User.email).join(User, AIUsage.user_id == User.id).filter(AIUsage.user_id == user.id).order_by(AIUsage.timestamp.desc()).all()
        
    return jsonify([{
        "id": r[0].id,
        "user": r[1],
        "model": r[0].model_used,
        "input": r[0].tokens_input,
        "output": r[0].tokens_output,
        "status": r[0].status,
        "timestamp": r[0].timestamp.isoformat()
    } for r in results]), 200

@app.route('/api/ai/explain', methods=['POST'])
@jwt_required()
def ai_explain_stream():
    data = request.get_json()
    analysis_results = data.get('results')
    mode = data.get('mode', 'researcher')
    
    if not analysis_results:
        return jsonify({"msg": "Missing analysis results"}), 400
    
    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).first()

    def generate():
        # Generator wrapper to capture model usage and log to DB
        stream = ai_bio_engine.generate_explanation_stream(analysis_results, mode)
        model_used = "unknown"
        first_chunk = True
        full_text_len = 0
        
        try:
            for chunk in stream:
                if chunk.startswith("__MODEL_USED__:"):
                    model_used = chunk.split(":", 1)[1].strip()
                    yield chunk # Pass header to frontend too!
                    continue
                
                full_text_len += len(chunk)
                yield chunk
            
            # Log success after stream finishes
            with app.app_context():
                # Re-fetch user to ensure session attached
                u = User.query.get(user.id) 
                usage = AIUsage(
                    user_id=u.id,
                    model_used=model_used,
                    tokens_input=0, # Approximation not calculated here
                    tokens_output=full_text_len // 4, # Rough est
                    status='success'
                )
                db.session.add(usage)
                db.session.commit()
                
        except Exception as e:
            print(f"Stream Error: {e}")
            with app.app_context():
                u = User.query.get(user.id)
                usage = AIUsage(
                    user_id=u.id,
                    model_used=model_used,
                    status='failed'
                )
                db.session.add(usage)
                db.session.commit()
            yield f"\n[Error: Connection interrupted - {str(e)}]"

    return Response(generate(), mimetype='text/plain')

# WebRTC Signaling for Screen Sharing
@socketio.on('webrtc-offer')
def handle_offer(data):
    room = data.get('room')
    if room:
        emit('webrtc-offer', data, room=room, include_self=False)

@socketio.on('webrtc-answer')
def handle_answer(data):
    room = data.get('room')
    if room:
        emit('webrtc-answer', data, room=room, include_self=False)

@socketio.on('webrtc-ice-candidate')
def handle_ice_candidate(data):
    room = data.get('room')
    if room:
        emit('webrtc-ice-candidate', data, room=room, include_self=False)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))

    @app.route('/api/auth/ping', methods=['GET'])
    def ping():
        return jsonify({"msg": "pong"}), 200
    debug = os.environ.get('FLASK_DEBUG', 'True') == 'True'
    
    with app.app_context():
        db.create_all()
        # Seed default admin if missing
        admin_email = os.environ.get('ADMIN_EMAIL', 'admin@geneforge.com')
        admin_pass = os.environ.get('ADMIN_PASSWORD', 'admin123')
        admin = User.query.filter_by(role='admin').first()
        if not admin:
            print(f"SEeding default admin account: {admin_email}")
            salt = os.urandom(16)
            admin = User(
                email=admin_email,
                role='admin',
                salt=salt,
                password_hash=generate_password_hash(admin_pass)
            )
            db.session.add(admin)
            db.session.commit()
    
    try:
        print(f"Initializing Analysis Engine on port {port}...")
        print(f"CORS allowed origins: {allowed_origins}")
        # On Windows, we need allow_unsafe_werkzeug=True for SocketIO with debug
        socketio.run(app, host='0.0.0.0', port=port, debug=debug, allow_unsafe_werkzeug=True)
    except Exception as e:
        if "10048" in str(e):
            print(f"PORT {port} CONFLICT: Attempting recovery on backup port...")
            socketio.run(app, host='0.0.0.0', port=port + 1, debug=debug, allow_unsafe_werkzeug=True)
        else:
            raise e
