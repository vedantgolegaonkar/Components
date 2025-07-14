import os 
import re 
import smtplib
from email.mime.text import MIMEText 

def check_email(identifier):
    email_pattern = r"^[\w\.-]+@[\w\.-]+\.\w+$"
    if re.match(email_pattern, identifier):
        return True
    else:
        return False



