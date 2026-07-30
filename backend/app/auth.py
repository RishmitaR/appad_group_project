import bcrypt

def hash_password(password: str) -> bytes:
    """Hashes a plain-text password using a random salt."""
    # Convert password string to bytes
    password_bytes = password.encode('utf-8')
    # Generate a unique salt and hash the password
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password_bytes, salt)

def verify_password(stored_hash: bytes, provided_password: str) -> bool:
    """Verifies a provided password against the stored hash."""
    provided_bytes = provided_password.encode('utf-8')
    return bcrypt.checkpw(provided_bytes, stored_hash)