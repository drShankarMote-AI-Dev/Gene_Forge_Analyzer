
import os
import sys
import argparse
from datetime import datetime

# Add apps/server to path to find app.py and its models
sys.path.append(os.path.join(os.getcwd(), 'apps', 'server'))

try:
    from app import app, db, User, AIUsage, AuditLog
    from werkzeug.security import generate_password_hash
except ImportError as e:
    print(f"Error: Could not import application modules. {e}")
    sys.exit(1)

def list_admins():
    """List all users with the admin role."""
    with app.app_context():
        admins = User.query.filter_by(role='admin').all()
        if not admins:
            print("No administrative accounts found.")
        else:
            print("\n--- ADMINISTRATIVE PERSONNEL ---")
            for admin in admins:
                print(f"ID: {admin.id} | Email: {admin.email} | Role: {admin.role} | Joined: {admin.created_at}")
            print("--------------------------------\n")

def reset_admin(email, password):
    """Create or update an admin account with a specific password."""
    with app.app_context():
        user = User.query.filter_by(email=email).first()
        if not user:
            print(f"Creating new admin account: {email}")
            # Generate a unique salt
            salt = os.urandom(16)
            user = User(email=email, role='admin', salt=salt)
            db.session.add(user)
        else:
            print(f"Updating existing account: {email}")
            user.role = 'admin'
        
        user.password_hash = generate_password_hash(password)
        db.session.commit()
        print(f"SUCCESS: Account {email} is now a System Administrator with password: {password}")

def fix_admin_role(email):
    """Ensure a specific email has the admin role."""
    with app.app_context():
        user = User.query.filter_by(email=email).first()
        if user:
            user.role = 'admin'
            db.session.commit()
            print(f"SUCCESS: Role for {email} synchronized to 'admin'.")
        else:
            print(f"ERROR: User {email} not found in database.")

def check_telemetry():
    """Check AI usage and system health."""
    with app.app_context():
        usage_count = AIUsage.query.count()
        logs_count = AuditLog.query.count()
        users_count = User.query.count()
        
        print("\n--- SYSTEM TELEMETRY ---")
        print(f"Total Registered Nodes: {users_count}")
        print(f"AI Inference Events:    {usage_count}")
        print(f"Audit Log Entries:      {logs_count}")
        
        last_logs = AuditLog.query.order_by(AuditLog.timestamp.desc()).limit(5).all()
        print("\nRecent Activity Stream:")
        for log in last_logs:
            print(f"[{log.timestamp}] {log.action}: {log.details}")
        print("------------------------\n")

def main():
    parser = argparse.ArgumentParser(description="Gene Forge Administrative Terminal Utilities")
    subparsers = parser.add_subparsers(dest='command', help='Commands')

    # List
    subparsers.add_parser('list', help='List all administrators')

    # Reset/Create
    reset_parser = subparsers.add_parser('reset', help='Create or reset admin credentials')
    reset_parser.add_argument('--email', required=True, help='Admin email')
    reset_parser.add_argument('--password', required=True, help='Admin password')

    # Fix
    fix_parser = subparsers.add_parser('fix', help='Synchronize admin role for an email')
    fix_parser.add_argument('--email', required=True, help='Target email')

    # Telemetry
    subparsers.add_parser('status', help='Check system telemetry and logs')

    args = parser.parse_args()

    if args.command == 'list':
        list_admins()
    elif args.command == 'reset':
        reset_admin(args.email, args.password)
    elif args.command == 'fix':
        fix_admin_role(args.email)
    elif args.command == 'status':
        check_telemetry()
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
