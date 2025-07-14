import os
import sys
from fastapi import FastAPI
from dotenv import load_dotenv

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..')))
from microservices.verification_service.email_verification.validator import check_email

load_dotenv()

app = FastAPI(
        title="Email Verification Service",
        description="   NONE  ",#change when needed
        version="1.0.0"
        )

print(os.getenv("SERVICE_URL"))

print(check_email("siddharthvarade@3csolutions.com"))
