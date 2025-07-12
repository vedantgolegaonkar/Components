import os
import re
import uvicorn
import httpx
import requests
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse

load_dotenv()

services = {
        "user_authentication_service": os.getenv("AUTHENTICATION_SERVICE_URL")
        }

app = FastAPI(
        title="API Gateway",
        description="   NONE  ",#change when needed
        version="1.0.0"
        )

def get_identifier_type(identifier):
    email_pattern = r"^[\w\.-]+@[\w\.-]+\.\w+$"
    phone_pattern = r"^\+?\d{10,15}$"  # allows optional + and 10-15 digits
    if re.match(email_pattern, identifier):
        return "email"
    elif re.match(phone_pattern, identifier):
        return "phone"
    else:
        return "unknown"


# ------------------------
# This controller is to route the request to the signup endpoint 
# ------------------------
@app.post("/api/signup")
async def signup_controller(request: Request):
    try:
        payload = await request.json()
    except Exception as e:
        return {"message" : "Invalid request, unable to parse JSON"}

    if not payload:
        return {"message" : "Invalid request, empty payload"}
    print(payload)
    response = requests.post(f"{services['user_authentication_service']}/api/signup", json=payload)
    try:
        data = response.json()
    except:
        data = response.text
    return {"message": data}


# ------------------------
# This controller is to route the request to the login endpoints 
# ------------------------
@app.post("/api/signin")
async def signin_controller(request: Request):
    try:
        payload = await request.json()
    except Exception as e:
        return {"message" : "Invalid request, unable to parse JSON"}
    if not payload:
        return {"message" : "Invalid request, empty payload"}

    id_type = get_identifier_type(str(payload.get("identifier")))

    if(id_type == "email"):
        try:
            response = requests.post(f"{services['user_authentication_service']}/api/login-by-email", json=payload)
        except Exception as e:
            print(e)

    elif(id_type == "phone"):
        try:
            response = requests.post(f"{services['user_authentication_service']}/api/login-by-phonenumber", json=payload)
        except Exception as e:
            print(e)
    
    else:
        return JSONResponse(
                status_code=400,
                content={"message" : "Please enter a valid email or phone number"}
                )
    try:
        data = response.json()
    except:
        data = response.text
    return {"message": data }


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

