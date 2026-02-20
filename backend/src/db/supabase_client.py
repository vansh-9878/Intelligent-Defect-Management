import os
from supabase import create_client, Client
from dotenv import load_dotenv
load_dotenv()

from src.logger import logging

class SupabaseClient:
    client=None
    def __init__(self):
        try:
            SUPABASE_URL = os.getenv("SUPABASE_URL")
            SUPABASE_KEY = os.getenv("SUPABASE_KEY")

            sup: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
            self.client=sup
            logging.info("Connected to supabase")
        except Exception as e:
            logging.error("Could not connect to supabase: %s",e)

