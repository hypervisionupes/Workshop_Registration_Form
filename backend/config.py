import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env file from backend directory
backend_dir = Path(__file__).resolve().parent
env_path = backend_dir / ".env"
load_dotenv(dotenv_path=env_path)

SUPABASE_URL = os.getenv("SUPABASE_URL", "https://steqqorpeqcwgdbmilkw.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "sb_publishable_FF_VZ90DqpA39Qvd74AFhQ_LcaOvO6K")
RESEND_API_KEY = os.getenv("RESEND_API_KEY", "re_P1UqJ27D_HyoJ32H2HxCYqT72DiLd3jPr")
WHATSAPP_GROUP_LINK = os.getenv(
    "WHATSAPP_GROUP_LINK",
    "https://chat.whatsapp.com/Iwoh6JEeqp21xG2gfVgBqP?mode=gi_t"
)
PORT = int(os.getenv("PORT", 5000))
