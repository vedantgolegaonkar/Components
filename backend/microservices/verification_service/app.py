from fastapi import FastAPI

app = FastAPI()

@app.post('/email-verification-service')
def verify_email():
    pass

@app.post('/phone-verification-service')
def verify_phone():
    pass

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8002, reload=True)

