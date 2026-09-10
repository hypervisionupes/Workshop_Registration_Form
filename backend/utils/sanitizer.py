import re

def sanitize_string(value, max_length=None):
    """Sanitize string input by stripping whitespace, control characters, and limiting length."""
    if value is None:
        return ""
    if not isinstance(value, str):
        value = str(value)
    
    # Remove null bytes and control characters
    sanitized = re.sub(r'[\x00-\x1f\x7f-\x9f]', '', value)
    sanitized = sanitized.strip()
    
    if max_length and len(sanitized) > max_length:
        sanitized = sanitized[:max_length]
    
    return sanitized
