from fastapi import FastAPI, HTTPException, Header
from pydantic import BaseModel, EmailStr
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv

load_dotenv()  # Load .env file

app = FastAPI(title="Secure Email Service")

class EmailContent(BaseModel):
    receiver_email: EmailStr
    subject: str
    body: str

class EmailSender:
    def __init__(self, sender_email, sender_password, smtp_server="smtp.gmail.com", port=587):
        self.sender_email = sender_email
        self.smtp_server = smtp_server
        self.port = port
        try:
            self.server = smtplib.SMTP(self.smtp_server, self.port)
            self.server.starttls()
            self.server.login(sender_email, sender_password)
            print("SMTP logged in successfully.")
        except Exception as e:
            print(f"Failed to connect/login to SMTP: {e}")
            self.server = None

    def send_email(self, receiver_email, subject, body):
        if not self.server:
            raise Exception("SMTP server not initialized.")

        message = MIMEMultipart()
        message["From"] = self.sender_email
        message["To"] = receiver_email
        message["Subject"] = subject
        message.attach(MIMEText(body, "plain"))

        try:
            self.server.sendmail(self.sender_email, receiver_email, message.as_string())
        except Exception as e:
            raise Exception(f"Error sending email: {e}")

    def close(self):
        if self.server:
            self.server.quit()
            print("SMTP connection closed.")

# Global email sender object
email_sender = None
API_KEY = os.getenv("EMAIL_SERVICE_API_KEY")  # Your secure API key

@app.on_event("startup")
def startup_event():
    global email_sender
    sender_email = os.getenv("SERVICE_URL")
    sender_password = os.getenv("SERVICE_PASSWORD")
    if not sender_email or not sender_password:
        raise RuntimeError("Email credentials are missing in environment.")
    email_sender = EmailSender(sender_email, sender_password)

@app.on_event("shutdown")
def shutdown_event():
    global email_sender
    if email_sender:
        email_sender.close()

@app.post("/send-email")
def send_email(
    email: EmailContent,
    x_api_key: str = Header(..., description="API key for authentication")
):
    global email_sender

    if x_api_key != API_KEY:
        raise HTTPException(status_code=401, detail="Invalid API key.")

    if not email_sender:
        raise HTTPException(status_code=500, detail="Email sender not initialized.")

    try:
        email_sender.send_email(email.receiver_email, email.subject, email.body)
        return {"message": f"Email sent to {email.receiver_email}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8002, reload=True)

