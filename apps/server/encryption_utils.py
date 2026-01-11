import os
import base64
from Crypto.Cipher import AES
from Crypto.Protocol.KDF import PBKDF2
from Crypto.Random import get_random_bytes

# Derive a user-specific key from the master key and user salt
def get_user_key(user_email, user_salt):
    master_key = os.environ.get('MASTER_KEY', 'default-master-key-must-be-changed-in-prod')
    # Derive a 32-byte (256-bit) key
    key = PBKDF2(master_key + user_email, user_salt, dkLen=32, count=1000)
    return key

def encrypt_data(data, user_email, user_salt):
    if not data:
        return None
    
    key = get_user_key(user_email, user_salt)
    cipher = AES.new(key, AES.MODE_GCM)
    ciphertext, tag = cipher.encrypt_and_digest(data.encode('utf-8'))
    
    # Store nonce, tag, and ciphertext
    # Format: base64(nonce) | base64(tag) | base64(ciphertext)
    result = base64.b64encode(cipher.nonce).decode('utf-8') + "|" + \
             base64.b64encode(tag).decode('utf-8') + "|" + \
             base64.b64encode(ciphertext).decode('utf-8')
    return result

def decrypt_data(encrypted_str, user_email, user_salt):
    if not encrypted_str:
        return None
    
    try:
        parts = encrypted_str.split("|")
        if len(parts) != 3:
            return "[Error: Invalid format]"
            
        nonce = base64.b64decode(parts[0])
        tag = base64.b64decode(parts[1])
        ciphertext = base64.b64decode(parts[2])
        
        key = get_user_key(user_email, user_salt)
        cipher = AES.new(key, AES.MODE_GCM, nonce=nonce)
        decrypted_data = cipher.decrypt_and_verify(ciphertext, tag)
        return decrypted_data.decode('utf-8')
    except Exception as e:
        print(f"Decryption error: {e}")
        return "[Error: Decryption failed]"
