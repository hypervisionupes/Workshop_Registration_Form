from supabase import create_client, Client
import config

_supabase_client: Client = None

def get_supabase() -> Client:
    """Initialize and return the Supabase client instance."""
    global _supabase_client
    if _supabase_client is None:
        if not config.SUPABASE_URL or not config.SUPABASE_KEY:
            raise ValueError("SUPABASE_URL and SUPABASE_KEY must be configured in environment or .env")
        _supabase_client = create_client(config.SUPABASE_URL, config.SUPABASE_KEY)
    return _supabase_client

# Alias for backward compatibility with previous codebase
def get_db():
    return get_supabase()
